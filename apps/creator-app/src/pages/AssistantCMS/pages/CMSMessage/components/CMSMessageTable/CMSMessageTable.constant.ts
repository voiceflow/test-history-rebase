import { Enum } from '@voiceflow/dtos';

export const ResponseTableColumn = {
  ALL: 'All responses',
  SELECT: 'select',
  UPDATED: 'updated',
  USED_BY: 'used-by',
  LAST_EDITOR: 'last-editor',
} as const;

export type ResponseTableColumn = Enum<typeof ResponseTableColumn>;
