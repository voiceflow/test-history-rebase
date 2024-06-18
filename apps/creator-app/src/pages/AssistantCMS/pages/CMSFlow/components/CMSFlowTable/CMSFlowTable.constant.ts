import { Enum } from '@voiceflow/dtos';

export const FlowTableColumn = {
  NAME: 'name',
  SELECT: 'select',
  UPDATED: 'updated',
  USED_BY: 'used-by',
  DESCRIPTION: 'description',
  LAST_EDITOR: 'last-editor',
} as const;

export type FlowTableColumn = Enum<typeof FlowTableColumn>;
