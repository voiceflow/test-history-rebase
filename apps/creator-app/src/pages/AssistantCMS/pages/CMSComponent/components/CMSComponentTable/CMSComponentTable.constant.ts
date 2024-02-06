import { Enum } from '@voiceflow/dtos';

export const ComponentTableColumn = {
  NAME: 'name',
  SELECT: 'select',
  UPDATED: 'updated',
  DESCRIPTION: 'description',
  LAST_EDITOR: 'last-editor',
} as const;

export type ComponentTableColumn = Enum<typeof ComponentTableColumn>;
