import type { Enum } from '@/utils/type/enum.util';

export const WorkflowStatus = {
  TO_DO: 'to_do',
  COMPLETE: 'complete',
  IN_PROGRESS: 'in_progress',
} as const;

export type WorkflowStatus = Enum<typeof WorkflowStatus>;
