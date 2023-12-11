import { Enum } from '@voiceflow/dtos';

export const KnowledgeBaseTableColumn = {
  NAME: 'name',
  TYPE: 'type',
  DATE: 'date',
  SELECT: 'select',
  STATUS: 'status',
  REFRESH: 'refresh',
} as const;

export type KnowledgeBaseTableColumn = Enum<typeof KnowledgeBaseTableColumn>;
