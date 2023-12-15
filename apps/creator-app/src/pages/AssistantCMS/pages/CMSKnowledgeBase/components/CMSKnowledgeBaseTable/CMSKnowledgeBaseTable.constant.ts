import { Enum } from '@voiceflow/dtos';

export const KnowledgeBaseTableColumn = {
  SELECT: 'select',
  NAME: 'name',
  DATE: 'date',
  STATUS: 'status',
  TYPE: 'type',
  REFRESH: 'refresh',
  IMPORTED_BY: 'imported_by',
};

export type KnowledgeBaseTableColumn = Enum<typeof KnowledgeBaseTableColumn>;
