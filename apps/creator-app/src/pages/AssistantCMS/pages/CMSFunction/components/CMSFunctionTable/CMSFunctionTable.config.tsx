import { Table, type TableConfig } from '@voiceflow/ui-next';
import React from 'react';

import { CMSManagerConsumer } from '@/pages/AssistantCMS/contexts/CMSManager';

import { CMSTableCellFromNowTooltip } from '../../../../components/CMSTableCellFromNowTooltip/CMSTableCellFromNowTooltip.component';
import { CMSTableHighlightedTooltip } from '../../../../components/CMSTableHighlightedTooltip/CMSTableHighlightedTooltip.component';
import { CMSTableMemberCell } from '../../../../components/CMSTableMemberCell/CMSTableMemberCell.component';
import { CMSTableNameCell } from '../../../../components/CMSTableNameCell/CMSTableNameCell.component';
import type { CMSFolder, CMSFunction } from '../../../../contexts/CMSManager/CMSManager.interface';
import {
  updatedAtSort,
  withFieldLocaleCompareSort,
  withFolderSort,
} from '../../../../contexts/CMSManager/CMSManager.util';
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
      sorter: withFolderSort<CMSFunction>(withFieldLocaleCompareSort('name')),

      cell: ({ item, type }) => (
        <CMSTableNameCell type={type} name={item.name} isFolder={item.group} itemID={item.id} />
      ),
    },

    [FunctionTableColumn.DESCRIPTION]: {
      type: FunctionTableColumn.DESCRIPTION,
      name: 'Description',
      sorter: withFolderSort<CMSFunction>(withFieldLocaleCompareSort('description')),

      cell: ({ item }) => (
        <Table.Cell.GroupEmpty
          item={item}
          label={({ description }) =>
            description ? (
              <CMSManagerConsumer
                field="search"
                render={(search) => <CMSTableHighlightedTooltip label={description} search={search} />}
              />
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
      cell: ({ item }) => (
        <Table.Cell.GroupEmpty
          item={item}
          label={({ updatedByID }) => <CMSTableMemberCell creatorID={updatedByID} />}
        />
      ),
    },

    [FunctionTableColumn.UPDATED]: {
      type: FunctionTableColumn.UPDATED,
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
