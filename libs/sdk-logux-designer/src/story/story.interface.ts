import type { TabularResource } from '@/common';

import type { StoryStatus } from './story-status.enum';

export interface Story extends TabularResource {
  description: string | null;
  status: StoryStatus | null;
  isEnabled: boolean;
  isStart: boolean;
  triggerOrder: string[];
  assigneeID: number;
  flowID: string | null;
}
