import { Table, type TableConfig } from '@voiceflow/ui-next';
import React from 'react';

import { CMSTableNameCell } from '@/pages/AssistantCMS/components/CMSTableNameCell/CMSTableNameCell.component';

import { CMSTableCellFromNowTooltip } from '../../../../components/CMSTableCellFromNowTooltip/CMSTableCellFromNowTooltip.component';
import { CMSTableMemberCell } from '../../../../components/CMSTableMemberCell/CMSTableMemberCell.component';
import type { CMSFolder, CMSMessage } from '../../../../contexts/CMSManager/CMSManager.interface';
import {
  updatedAtSort,
  withFieldLocaleCompareSort,
  withFolderSort,
} from '../../../../contexts/CMSManager/CMSManager.util';
import { ResponseTableColumn } from './CMSMessageTable.constant';
import { CMSResponseTableVariantCell } from './CMSMessageTableVariantCell/CMSMessageTableVariantCell.component';
import { CMSResponseTableUsedByCell } from './CMSResponseTableUsedByCell.component';

export const CMS_RESPONSE_TABLE_CONFIG: TableConfig<ResponseTableColumn, CMSFolder | CMSMessage> = {
  columns: {
    [ResponseTableColumn.SELECT]: {
      type: ResponseTableColumn.SELECT,
      name: 'Select',
      cell: ({ item }) => <Table.Cell.Select item={item} />,
      header: () => <Table.Header.Cell.Select />,
    },

    [ResponseTableColumn.ALL]: {
      type: ResponseTableColumn.ALL,
      name: 'All messages',
      sorter: withFolderSort<CMSMessage>(withFieldLocaleCompareSort('name')),

      cell: ({ item, type }) =>
        item.group ? (
          <CMSTableNameCell type={type} name={item.name} isFolder={item.group} itemID={item.id} />
        ) : (
          <CMSResponseTableVariantCell response={item} />
        ),
    },

    [ResponseTableColumn.USED_BY]: {
      type: ResponseTableColumn.USED_BY,
      name: 'Used by',

      cell: ({ item }) => (
        <Table.Cell.GroupEmpty item={item} label={(item) => <CMSResponseTableUsedByCell messageID={item.id} />} />
      ),
    },

    [ResponseTableColumn.LAST_EDITOR]: {
      type: ResponseTableColumn.LAST_EDITOR,
      name: 'Last editor',

      cell: ({ item }) => (
        <Table.Cell.GroupEmpty
          item={item}
          label={({ updatedByID }) => <CMSTableMemberCell creatorID={updatedByID} />}
        />
      ),
    },

    [ResponseTableColumn.UPDATED]: {
      type: ResponseTableColumn.UPDATED,
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
