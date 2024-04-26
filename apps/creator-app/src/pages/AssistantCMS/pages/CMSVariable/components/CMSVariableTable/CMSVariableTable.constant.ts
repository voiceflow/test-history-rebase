import type { Enum } from '@voiceflow/dtos';

export const VariableTableColumn = {
  NAME: 'name',
  SELECT: 'select',
  UPDATED: 'updated',
  DESCRIPTION: 'description',
  LAST_EDITOR: 'last-editor',
  DEFAULT_VALUE: 'default-value',
} as const;

export type VariableTableColumn = Enum<typeof VariableTableColumn>;
