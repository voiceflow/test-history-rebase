import type { TableColumnOrder } from '@voiceflow/ui-next';
import { Table } from '@voiceflow/ui-next';
import { atom } from 'jotai';

import { FunctionTableColumn } from './CMSFunctionTable.constant';

export const functionColumnsOrderAtom = atom<TableColumnOrder<FunctionTableColumn>[]>([
  { type: FunctionTableColumn.SELECT, size: Table.Header.Cell.Select.CELL_WIDTH },
  { type: FunctionTableColumn.NAME, size: '2fr' },
  { type: FunctionTableColumn.DESCRIPTION, size: '2fr' },
  { type: FunctionTableColumn.LAST_EDITOR },
  { type: FunctionTableColumn.UPDATED },
]);
