import type { TableColumnOrder } from '@voiceflow/ui-next';
import { Table } from '@voiceflow/ui-next';
import { atom } from 'jotai';

import { ResponseTableColumn } from './CMSMessageTable.constant';

export const responseColumnsOrderAtom = atom<TableColumnOrder<ResponseTableColumn>[]>([
  { type: ResponseTableColumn.SELECT, size: Table.Header.Cell.Select.CELL_WIDTH },
  { type: ResponseTableColumn.ALL, size: '2fr' },
  { type: ResponseTableColumn.STORIES_USING },
  { type: ResponseTableColumn.LAST_EDITOR },
  { type: ResponseTableColumn.UPDATED },
]);
