import type { TableColumnOrder } from '@voiceflow/ui-next';
import { Table } from '@voiceflow/ui-next';
import { atom } from 'jotai';

import { EntityTableColumn } from './CMSEntityTable.constant';

export const entityColumnsOrderAtom = atom<TableColumnOrder<EntityTableColumn>[]>([
  { type: EntityTableColumn.SELECT, size: Table.Header.Cell.Select.CELL_WIDTH },
  { type: EntityTableColumn.NAME, size: '2fr' },
  { type: EntityTableColumn.DESCRIPTION, size: '3fr' },
  { type: EntityTableColumn.TYPE },
  { type: EntityTableColumn.LAST_EDITOR },
  { type: EntityTableColumn.UPDATED },
]);
