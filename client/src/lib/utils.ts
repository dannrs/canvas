import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractTrackId(url: string): string | null {
  const match = url.match(/\/track\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

export function getCanvasDownloadUrl(url: string) {
  return `${API_BASE_URL}/canvas/download?url=${encodeURIComponent(url)}`;
}
