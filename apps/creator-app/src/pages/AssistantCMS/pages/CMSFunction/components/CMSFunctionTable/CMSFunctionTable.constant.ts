import { Enum } from '@voiceflow/dtos';

export const FunctionTableColumn = {
  NAME: 'name',
  SELECT: 'select',
  UPDATED: 'updated',
  DESCRIPTION: 'description',
  LAST_EDITOR: 'last-editor',
} as const;

export type FunctionTableColumn = Enum<typeof FunctionTableColumn>;
