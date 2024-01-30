import type { TableColumnOrder } from '@voiceflow/ui-next';
import { Table } from '@voiceflow/ui-next';
import { atom } from 'jotai';

import { VariableTableColumn } from './CMSVariableTable.constant';

export const variableColumnsOrderAtom = atom<TableColumnOrder<VariableTableColumn>[]>([
  { type: VariableTableColumn.SELECT, size: Table.Header.Cell.Select.CELL_WIDTH },
  { type: VariableTableColumn.NAME, size: '2fr' },
  { type: VariableTableColumn.DESCRIPTION, size: '3fr' },
  { type: VariableTableColumn.DEFAULT_VALUE },
  { type: VariableTableColumn.LAST_EDITOR },
  { type: VariableTableColumn.UPDATED },
]);
