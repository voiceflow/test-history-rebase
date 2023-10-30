import { Table, type TableConfig } from '@voiceflow/ui-next';
import React from 'react';

import { CMSManagerConsumer } from '@/pages/AssistantCMS/contexts/CMSManager';

import { CMSTableCellFromNowTooltip } from '../../../../components/CMSTableCellFromNowTooltip';
import { CMSTableHighlightedTooltip } from '../../../../components/CMSTableHighlightedTooltip';
import { CMSTableLastEditedCell } from '../../../../components/CMSTableLastEditedCell/CMSTableLastEditedCell.component';
import type { CMSFolder, CMSFunction } from '../../../../contexts/CMSManager/CMSManager.interface';
import { updatedAtSort, withFolderSort, withLocaleCompareSort } from '../../../../contexts/CMSManager/CMSManager.util';
import { FunctionTableColumn } from './CMSFunctionTable.constant';

export const FUNCTION_TABLE_CONFIG: TableConfig<FunctionTableColumn, CMSFolder | CMSFunction> = {
  columns: {
    [FunctionTableColumn.SELECT]: {
      type: FunctionTableColumn.SELECT,
      name: 'Select',
      cell: ({ item }) => <Table.Cell.Select item={item} />,
      header: () => <Table.Header.Cell.Select />,
    },

    [FunctionTableColumn.NAME]: {
      type: FunctionTableColumn.NAME,
      name: 'Name',
      sorter: withFolderSort<CMSFunction>(withLocaleCompareSort('name')),

      cell: ({ item }) => <CMSManagerConsumer field="search" render={(search) => <CMSTableHighlightedTooltip label={item.name} search={search} />} />,
    },

    [FunctionTableColumn.DESCRIPTION]: {
      type: FunctionTableColumn.DESCRIPTION,
      name: 'Description',
      sorter: withFolderSort<CMSFunction>(withLocaleCompareSort('description')),

      cell: ({ item }) => (
        <Table.Cell.GroupEmpty
          item={item}
          label={({ description }) =>
            description ? (
              <CMSManagerConsumer field="search" render={(search) => <CMSTableHighlightedTooltip label={description} search={search} />} />
            ) : (
              <Table.Cell.Empty />
            )
          }
        />
      ),
    },

    [FunctionTableColumn.LAST_EDITOR]: {
      type: FunctionTableColumn.LAST_EDITOR,
      name: 'Last editor',
      cell: ({ item }) => <Table.Cell.GroupEmpty item={item} label={({ updatedByID }) => <CMSTableLastEditedCell creatorID={updatedByID} />} />,
    },

    [FunctionTableColumn.UPDATED]: {
      type: FunctionTableColumn.UPDATED,
      name: 'Updated',
      sorter: withFolderSort(updatedAtSort),

      cell: ({ item }) => <CMSTableCellFromNowTooltip updatedAt={item.updatedAt} />,
    },
  },
};
