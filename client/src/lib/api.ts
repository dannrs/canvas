import { hc } from 'hono/client';
import { type ApiRoutes } from '../../../server/app';
import { queryOptions } from '@tanstack/react-query';

const client = hc<ApiRoutes>('/');

export const api = client.api;

export const canvasQueryOptions = (id: string) =>
  queryOptions({
    enabled: !!id,
    queryKey: ['get-canvas', id],
    queryFn: () =>
      api.canvas.view.$get({ query: { id: id } }).then((res) => res.json()),
  });
