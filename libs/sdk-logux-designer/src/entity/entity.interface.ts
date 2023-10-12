import type { TabularResource } from '@/common';

export interface Entity extends TabularResource {
  color: string;
  isArray: boolean;
  classifier: string | null;
  description: string | null;
}
