import type { TabularResource } from '@/common';

export interface Flow extends TabularResource {
  diagramID: string;
  description: string | null;
}
