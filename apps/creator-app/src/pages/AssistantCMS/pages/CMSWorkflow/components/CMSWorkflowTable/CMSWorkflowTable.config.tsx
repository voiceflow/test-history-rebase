import { Table, type TableConfig } from '@voiceflow/ui-next';
import React from 'react';

import { CMSTableCellFromNowTooltip } from '../../../../components/CMSTableCellFromNowTooltip/CMSTableCellFromNowTooltip.component';
import { CMSTableCellTextTooltip } from '../../../../components/CMSTableCellTextTooltip/CMSTableCellTextTooltip.component';
import { CMSTableLastEditedCell } from '../../../../components/CMSTableLastEditedCell/CMSTableLastEditedCell.component';
import { CMSTableNameCell } from '../../../../components/CMSTableNameCell/CMSTableNameCell.component';
import type { CMSFlow, CMSFolder } from '../../../../contexts/CMSManager/CMSManager.interface';
import { updatedAtSort, withFieldLocaleCompareSort, withFolderSort } from '../../../../contexts/CMSManager/CMSManager.util';
import { WorkflowTableColumn } from './CMSWorkflowTable.constant';

export const CMS_WORKFLOW_TABLE_CONFIG: TableConfig<WorkflowTableColumn, CMSFolder | CMSFlow> = {
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
      sorter: withFolderSort<CMSFlow>(withFieldLocaleCompareSort('name')),

      cell: ({ item, type }) => <CMSTableNameCell type={type} name={item.name} itemID={item.id} />,
    },

    [WorkflowTableColumn.DESCRIPTION]: {
      type: WorkflowTableColumn.DESCRIPTION,
      name: 'Description',
      sorter: withFolderSort<CMSFlow>(withFieldLocaleCompareSort('description')),

      cell: ({ item }) => (
        <Table.Cell.GroupEmpty
          item={item}
          label={(item) => (item.description ? <CMSTableCellTextTooltip label={item.description} /> : <Table.Cell.Empty />)}
        />
      ),
    },

    [WorkflowTableColumn.LAST_EDITOR]: {
      type: WorkflowTableColumn.LAST_EDITOR,
      name: 'Last editor',

      cell: ({ item }) => <Table.Cell.GroupEmpty item={item} label={({ updatedByID }) => <CMSTableLastEditedCell creatorID={updatedByID} />} />,
    },

    [WorkflowTableColumn.UPDATED]: {
      type: WorkflowTableColumn.UPDATED,
      name: 'Updated',
      sorter: withFolderSort(updatedAtSort),

      cell: ({ item }) => <Table.Cell.GroupEmpty item={item} label={({ updatedAt }) => <CMSTableCellFromNowTooltip updatedAt={updatedAt} />} />,
    },
  },
};
