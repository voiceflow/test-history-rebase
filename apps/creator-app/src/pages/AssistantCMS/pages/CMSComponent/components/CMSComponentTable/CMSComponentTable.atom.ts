import type { TableColumnOrder } from '@voiceflow/ui-next';
import { Table } from '@voiceflow/ui-next';
import { atom } from 'jotai';

import { ComponentTableColumn } from './CMSComponentTable.constant';

export const componentColumnsOrderAtom = atom<TableColumnOrder<ComponentTableColumn>[]>([
  { type: ComponentTableColumn.SELECT, size: Table.Header.Cell.Select.CELL_WIDTH },
  { type: ComponentTableColumn.NAME, size: '2fr' },
  { type: ComponentTableColumn.DESCRIPTION, size: '3fr' },
  { type: ComponentTableColumn.LAST_EDITOR },
  { type: ComponentTableColumn.UPDATED },
]);
