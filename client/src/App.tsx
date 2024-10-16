import { CanvasForm } from '@/components/canvas-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Toaster } from '@/components/ui/sonner';

export default function App() {
  return (
    <main className='container mx-auto flex h-dvh items-center justify-center'>
      <Card className='h-[280px] w-4/5 py-4 sm:w-[600px]'>
        <div className='flex h-full flex-col items-center justify-center'>
          <CardHeader className='text-center'>
            <CardTitle>Canvas Downloader</CardTitle>
            <CardDescription>
              Download your Spotify track{' '}
              <a
                href='https://canvas.spotify.com/en-us'
                className='font-semibold underline'
              >
                canvas
              </a>{' '}
              easily
            </CardDescription>
          </CardHeader>
          <CardContent className='w-full'>
            <CanvasForm />
          </CardContent>
        </div>
      </Card>
      <Toaster position='top-center' />
    </main>
  );
}
