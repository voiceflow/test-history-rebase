import { Enum } from '@voiceflow/dtos';

export const ResponseTableColumn = {
  ALL: 'All responses',
  TYPE: 'type',
  SELECT: 'select',
  UPDATED: 'updated',
  USED_BY: 'used-by',
  LAST_EDITOR: 'last-editor',
  ATTACHMENTS: 'attachments',
} as const;

export type ResponseTableColumn = Enum<typeof ResponseTableColumn>;
