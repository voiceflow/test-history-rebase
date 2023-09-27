import type { TableColumnOrder } from '@voiceflow/ui-next';
import { Table } from '@voiceflow/ui-next';
import { atom } from 'jotai';

import { KnowledgeBaseTableColumn } from './CMSKnowledgeBaseTable.constant';

export const knowledgeBaseColumnsOrderAtom = atom<TableColumnOrder<KnowledgeBaseTableColumn>[]>([
  { type: KnowledgeBaseTableColumn.SELECT, size: Table.Header.Cell.Select.CELL_WIDTH },
  { type: KnowledgeBaseTableColumn.NAME },
  { type: KnowledgeBaseTableColumn.TYPE },
  { type: KnowledgeBaseTableColumn.STATUS },
  { type: KnowledgeBaseTableColumn.DATE },
]);
