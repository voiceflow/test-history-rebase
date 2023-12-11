import { Enum } from '@voiceflow/dtos';

export const EntityTableColumn = {
  NAME: 'name',
  TYPE: 'type',
  SELECT: 'select',
  UPDATED: 'updated',
  DESCRIPTION: 'description',
  LAST_EDITOR: 'last-editor',
} as const;

export type EntityTableColumn = Enum<typeof EntityTableColumn>;
