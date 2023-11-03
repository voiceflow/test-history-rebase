import type { TabularResource } from '@/common';

export interface Function extends TabularResource {
  code: string;
  image: string | null;
  description: string | null;
}
