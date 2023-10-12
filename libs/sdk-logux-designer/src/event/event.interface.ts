import type { TabularResource } from '@/common';

export interface Event extends TabularResource {
  requestName: string;
  description: string | null;
}
