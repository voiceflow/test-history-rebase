import type { TableColumnOrder } from '@voiceflow/ui-next';
import { Table } from '@voiceflow/ui-next';
import { atom } from 'jotai';

import { KnowledgeBaseTableColumn } from './CMSKnowledgeBaseTable.constant';

export const knowledgeBaseColumnsOrderAtom = atom<TableColumnOrder<KnowledgeBaseTableColumn>[]>([
  { type: KnowledgeBaseTableColumn.SELECT, size: Table.Header.Cell.Select.CELL_WIDTH },
  { type: KnowledgeBaseTableColumn.NAME, size: '3fr' },
  { type: KnowledgeBaseTableColumn.IMPORTED_BY, size: '175px' },
  { type: KnowledgeBaseTableColumn.TYPE, size: '80px' },
  { type: KnowledgeBaseTableColumn.DATE },
  { type: KnowledgeBaseTableColumn.STATUS, size: '80px' },
  { type: KnowledgeBaseTableColumn.REFRESH, size: '120px' },
]);
