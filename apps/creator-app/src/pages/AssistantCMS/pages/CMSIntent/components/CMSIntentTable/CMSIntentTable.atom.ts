import type { TableColumnOrder } from '@voiceflow/ui-next';
import { Table } from '@voiceflow/ui-next';
import { atom } from 'jotai';

import { IntentTableColumn } from './CMSIntentTable.constant';

export const intentColumnsOrderAtom = atom<TableColumnOrder<IntentTableColumn>[]>([
  { type: IntentTableColumn.SELECT, size: Table.Header.Cell.Select.CELL_WIDTH },
  { type: IntentTableColumn.NAME, size: '2fr' },
  { type: IntentTableColumn.DESCRIPTION, size: '2.5fr' },
  { type: IntentTableColumn.CONFIDENCE },
  { type: IntentTableColumn.LAST_EDITOR },
  { type: IntentTableColumn.UPDATED },
]);
