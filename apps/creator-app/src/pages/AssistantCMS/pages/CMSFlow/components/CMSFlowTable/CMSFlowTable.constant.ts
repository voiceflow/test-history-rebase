import type { Enum } from '@voiceflow/dtos';

export const FlowTableColumn = {
  NAME: 'name',
  SELECT: 'select',
  UPDATED: 'updated',
  DESCRIPTION: 'description',
  LAST_EDITOR: 'last-editor',
} as const;

export type FlowTableColumn = Enum<typeof FlowTableColumn>;
