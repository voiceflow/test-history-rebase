import { Enum } from '@voiceflow/dtos';

export const ResponseTableColumn = {
  ALL: 'All responses',
  SELECT: 'select',
  STORIES_USING: 'stories-using',
  UPDATED: 'updated',
  LAST_EDITOR: 'last-editor',
} as const;

export type ResponseTableColumn = Enum<typeof ResponseTableColumn>;
