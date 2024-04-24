import type { TableColumnOrder } from '@voiceflow/ui-next';
import { Table } from '@voiceflow/ui-next';
import { atom } from 'jotai';

import { WorkflowTableColumn } from './CMSWorkflowTable.constant';

export const workflowColumnsOrderAtom = atom<TableColumnOrder<WorkflowTableColumn>[]>([
  { type: WorkflowTableColumn.SELECT, size: Table.Header.Cell.Select.CELL_WIDTH },
  { type: WorkflowTableColumn.NAME, size: '2fr' },
  { type: WorkflowTableColumn.DESCRIPTION, size: '3fr' },
  { type: WorkflowTableColumn.TRIGGERS, size: '2fr' },
  { type: WorkflowTableColumn.STATUS },
  { type: WorkflowTableColumn.ASSIGNEE },
  { type: WorkflowTableColumn.UPDATED },
]);
