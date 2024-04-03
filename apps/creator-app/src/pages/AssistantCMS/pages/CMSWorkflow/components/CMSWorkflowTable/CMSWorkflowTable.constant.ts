import { Enum } from '@voiceflow/dtos';

export const WorkflowTableColumn = {
  NAME: 'name',
  SELECT: 'select',
  UPDATED: 'updated',
  DESCRIPTION: 'description',
  LAST_EDITOR: 'last-editor',
} as const;

export type WorkflowTableColumn = Enum<typeof WorkflowTableColumn>;
