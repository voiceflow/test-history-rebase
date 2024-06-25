import type { Enum } from '@voiceflow/dtos';

export const FunctionTableColumn = {
  NAME: 'name',
  SELECT: 'select',
  UPDATED: 'updated',
  USED_BY: 'used-by',
  DESCRIPTION: 'description',
  LAST_EDITOR: 'last-editor',
} as const;

export type FunctionTableColumn = Enum<typeof FunctionTableColumn>;
