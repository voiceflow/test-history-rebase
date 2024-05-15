import { Enum } from '@voiceflow/dtos';

export const ResponseTableColumn = {
  ALL: 'All responses',
  SELECT: 'select',
  ATTACHMENTS: 'attachments',
  TYPE: 'type',
  STORIES_USING: 'stories-using',
  UPDATED: 'updated',
  LAST_EDITOR: 'last-editor',
} as const;

export type ResponseTableColumn = Enum<typeof ResponseTableColumn>;
