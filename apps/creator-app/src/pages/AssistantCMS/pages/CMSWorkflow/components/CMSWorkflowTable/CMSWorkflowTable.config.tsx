import { WorkflowStatus } from '@voiceflow/dtos';
import { Table, type TableConfig } from '@voiceflow/ui-next';
import React from 'react';
import { match } from 'ts-pattern';

import { CMSTableCellFromNowTooltip } from '../../../../components/CMSTableCellFromNowTooltip/CMSTableCellFromNowTooltip.component';
import { CMSTableCellTextTooltip } from '../../../../components/CMSTableCellTextTooltip/CMSTableCellTextTooltip.component';
import { CMSTableMemberCell } from '../../../../components/CMSTableMemberCell/CMSTableMemberCell.component';
import { CMSTableNameCell } from '../../../../components/CMSTableNameCell/CMSTableNameCell.component';
import type { CMSFolder, CMSWorkflow } from '../../../../contexts/CMSManager/CMSManager.interface';
import {
  localeCompareSort,
  updatedAtSort,
  withFieldLocaleCompareSort,
  withFolderSort,
  withOptionalSort,
} from '../../../../contexts/CMSManager/CMSManager.util';
import { CMSWorkflowSortContext } from '../../CMSWorkflow.interface';
import { WorkflowTableColumn } from './CMSWorkflowTable.constant';
import { CMSWorkflowTableTriggersCell } from './CMSWorkflowTableTriggersCell.component';

export const CMS_WORKFLOW_TABLE_CONFIG: TableConfig<
  WorkflowTableColumn,
  CMSFolder | CMSWorkflow,
  CMSWorkflowSortContext
> = {
  columns: {
    [WorkflowTableColumn.SELECT]: {
      type: WorkflowTableColumn.SELECT,
      name: 'Select',
      cell: ({ item }) => <Table.Cell.Select item={item} />,
      header: () => <Table.Header.Cell.Select />,
    },

    [WorkflowTableColumn.NAME]: {
      type: WorkflowTableColumn.NAME,
      name: 'Name',
      sorter: withFolderSort<CMSWorkflow>((left, right, options) => {
        if (left.isStart || right.isStart) return (left.isStart ? 1 : -1) * (options.descending ? 1 : -1);

        return withFieldLocaleCompareSort('name')(left, right);
      }),

      cell: ({ item, type }) => (
        <CMSTableNameCell type={type} name={item.name} itemID={item.id} isFolder={item.group} />
      ),
    },

    [WorkflowTableColumn.DESCRIPTION]: {
      type: WorkflowTableColumn.DESCRIPTION,
      name: 'Description',
      sorter: withFolderSort<CMSWorkflow>(withFieldLocaleCompareSort('description')),

      cell: ({ item }) => (
        <Table.Cell.GroupEmpty
          item={item}
          label={(item) =>
            item.description ? <CMSTableCellTextTooltip label={item.description} /> : <Table.Cell.Empty />
          }
        />
      ),
    },

    [WorkflowTableColumn.TRIGGERS]: {
      type: WorkflowTableColumn.TRIGGERS,
      name: 'Triggers',
      sorter: withFolderSort<CMSWorkflow, CMSWorkflowSortContext>((left, right, { context }) =>
        withOptionalSort((left: number, right: number) => left - right)(
          context.triggersMapByDiagramID[left.diagramID]?.length,
          context.triggersMapByDiagramID[right.diagramID]?.length
        )
      ),

      cell: ({ item }) => (
        <Table.Cell.GroupEmpty
          item={item}
          label={(item) => <CMSWorkflowTableTriggersCell diagramID={item.diagramID} />}
        />
      ),
    },

    [WorkflowTableColumn.STATUS]: {
      type: WorkflowTableColumn.STATUS,
      name: 'Status',
      sorter: withFolderSort<CMSWorkflow>(withFieldLocaleCompareSort('status')),

      cell: ({ item }) => (
        <Table.Cell.GroupEmpty
          item={item}
          label={(item) => (
            <Table.Cell.Text
              label={match(item.status)
                .with(null, () => 'None')
                .with(WorkflowStatus.TO_DO, () => 'To do')
                .with(WorkflowStatus.COMPLETE, () => 'Done')
                .with(WorkflowStatus.IN_PROGRESS, () => 'In progress')
                .exhaustive()}
            />
          )}
        />
      ),
    },

    [WorkflowTableColumn.ASSIGNEE]: {
      type: WorkflowTableColumn.ASSIGNEE,
      name: 'Assignee',
      sorter: withFolderSort<CMSWorkflow, CMSWorkflowSortContext>((left, right, { context }) =>
        withOptionalSort(localeCompareSort)(
          left.assigneeID ? context.membersMap[left.assigneeID]?.name : null,
          right.assigneeID ? context.membersMap[right.assigneeID]?.name : null
        )
      ),

      cell: ({ item }) => (
        <Table.Cell.GroupEmpty item={item} label={({ assigneeID }) => <CMSTableMemberCell creatorID={assigneeID} />} />
      ),
    },

    [WorkflowTableColumn.LAST_EDITOR]: {
      type: WorkflowTableColumn.LAST_EDITOR,
      name: 'Last editor',

      cell: ({ item }) => (
        <Table.Cell.GroupEmpty
          item={item}
          label={({ updatedByID }) => <CMSTableMemberCell creatorID={updatedByID} />}
        />
      ),
    },

    [WorkflowTableColumn.UPDATED]: {
      type: WorkflowTableColumn.UPDATED,
      name: 'Updated',
      sorter: withFolderSort(updatedAtSort),

      cell: ({ item }) => (
        <Table.Cell.GroupEmpty
          item={item}
          label={({ updatedAt }) => <CMSTableCellFromNowTooltip updatedAt={updatedAt} />}
        />
      ),
    },
  },
};
