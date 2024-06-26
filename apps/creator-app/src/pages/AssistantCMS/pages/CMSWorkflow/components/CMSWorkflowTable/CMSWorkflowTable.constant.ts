import type { Enum } from '@voiceflow/dtos';

export const WorkflowTableColumn = {
  NAME: 'name',
  SELECT: 'select',
  STATUS: 'status',
  UPDATED: 'updated',
  ASSIGNEE: 'assignee',
  TRIGGERS: 'triggers',
  DESCRIPTION: 'description',
  LAST_EDITOR: 'last-editor',
} as const;

export type WorkflowTableColumn = Enum<typeof WorkflowTableColumn>;
