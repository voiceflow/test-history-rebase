import type { TabularResource } from '@/common';

export interface Intent extends TabularResource {
  description: string | null;
  entityOrder: string[];
  automaticReprompt: boolean;
}
