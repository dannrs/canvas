import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { canvasQueryOptions } from '@/lib/api';
import { getCanvasDownloadUrl } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Skeleton } from './ui/skeleton';

interface Props {
  trackId: string | null;
  open: boolean | undefined;
  onOpenChange: (open: boolean) => void;
  onDownload: () => void;
}

export function CanvasDialog({
  trackId,
  open,
  onOpenChange,
  onDownload,
}: Props) {
  const { data, isLoading } = useQuery(canvasQueryOptions(trackId ?? ''));
  const canvasDownloadUrl = getCanvasDownloadUrl(data?.canvasUrl ?? '');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Download Canvas</DialogTitle>
          <DialogDescription>
            Here's the canvas for the track you submitted:
          </DialogDescription>
        </DialogHeader>
        <div className='mx-auto flex flex-col items-center space-y-6'>
          {isLoading ? (
            <>
              <Skeleton className='h-[400px] w-[250px]' />
              <Skeleton className='h-10 w-24' />
            </>
          ) : (
            <>
              <video autoPlay controls loop muted width={232}>
                <source src={data?.canvasUrl} type='video/mp4' />
              </video>
              <Button
                asChild
                onClick={() => {
                  onDownload();
                  toast.info('Downloading...');
                }}
              >
                <a href={canvasDownloadUrl}>Download</a>
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
