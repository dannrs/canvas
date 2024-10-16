import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import { CanvasDialog } from '@/components/canvas-dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { canvasQueryOptions } from '@/lib/api';
import { extractTrackId } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { ClipboardPaste, LoaderCircle, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

const formSchema = z.object({
  trackUrl: z.string().url('Please enter a valid URL'),
});

export function CanvasForm() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [trackId, setTrackId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trackUrl: '',
    },
    mode: 'onChange',
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const extractedTrackId = extractTrackId(values.trackUrl);
      if (!extractedTrackId) {
        throw new Error('Invalid Spotify track URL');
      }

      const result = await queryClient.fetchQuery(
        canvasQueryOptions(extractedTrackId)
      );

      if (!result) {
        toast.error('The track has no canvas!');
      } else {
        setTrackId(extractedTrackId);
        setIsDialogOpen(true);
      }
    } catch (error) {
      toast.error('An error occurred while fetching the canvas.');
    } finally {
      form.reset();
    }
  }

  const handleDownload = () => {
    setIsDialogOpen(false);
  };

  const handlePaste = async (event: React.MouseEvent) => {
    event.preventDefault();

    if (!navigator.clipboard) {
      toast.error('Clipboard access not available. Please paste manually.');
      return;
    }

    try {
      const text = await navigator.clipboard.readText();
      form.setValue('trackUrl', text, { shouldValidate: true });
    } catch (error) {
      if (
        !(error instanceof DOMException && error.name === 'NotAllowedError')
      ) {
        console.error('Clipboard error:', error);
        toast.error('Failed to read clipboard. Please paste manually.');
      }
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='trackUrl'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className='relative flex items-center gap-2'>
                    <div className='relative flex w-full items-center'>
                      <Input
                        placeholder='Spotify Track URL'
                        {...field}
                        className='pr-10'
                      />
                      {field.value ? (
                        <X
                          className='absolute right-2 h-5 w-5 cursor-pointer'
                          onClick={() => form.reset()}
                        />
                      ) : (
                        <></>
                      )}
                    </div>
                    <Button
                      size='sm'
                      variant='outline'
                      className='h-10'
                      onClick={handlePaste}
                    >
                      <ClipboardPaste className='h-5 w-5' />
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type='submit'
            disabled={form.formState.isSubmitting || !form.formState.isValid}
            className='w-full'
          >
            {form.formState.isSubmitting ? (
              <>
                <LoaderCircle className='mr-2 h-4 w-4 animate-spin' />
                Processing...
              </>
            ) : (
              'Submit'
            )}
          </Button>
        </form>
      </Form>
      <CanvasDialog
        trackId={trackId}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onDownload={handleDownload}
      />
    </>
  );
}
