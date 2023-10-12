import type { TabularResource } from '@/common';

export interface Flow extends TabularResource {
  description: string | null;
  diagramID: string;
}
