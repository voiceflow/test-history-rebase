import type { TableColumnOrder } from '@voiceflow/ui-next';
import { Table } from '@voiceflow/ui-next';
import { atom } from 'jotai';

import { FlowTableColumn } from './CMSFlowTable.constant';

export const flowColumnsOrderAtom = atom<TableColumnOrder<FlowTableColumn>[]>([
  { type: FlowTableColumn.SELECT, size: Table.Header.Cell.Select.CELL_WIDTH },
  { type: FlowTableColumn.NAME, size: '2fr' },
  { type: FlowTableColumn.DESCRIPTION, size: '3fr' },
  { type: FlowTableColumn.LAST_EDITOR },
  { type: FlowTableColumn.UPDATED },
]);
