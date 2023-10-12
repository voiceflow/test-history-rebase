import type { TabularResource } from '@/common';

export interface Function extends TabularResource {
  description: string | null;
  code: string;
  image: string | null;
}
