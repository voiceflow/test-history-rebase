import { Channel, Language } from '@voiceflow/dtos';
import { Table, type TableConfig } from '@voiceflow/ui-next';
import React from 'react';

import { CMSTableNameCell } from '@/pages/AssistantCMS/components/CMSTableNameCell/CMSTableNameCell.component';

import { CMSTableCellFromNowTooltip } from '../../../../components/CMSTableCellFromNowTooltip/CMSTableCellFromNowTooltip.component';
import { CMSTableMemberCell } from '../../../../components/CMSTableMemberCell/CMSTableMemberCell.component';
import type { CMSFolder, CMSResponse } from '../../../../contexts/CMSManager/CMSManager.interface';
import {
  updatedAtSort,
  withFieldLocaleCompareSort,
  withFolderSort,
} from '../../../../contexts/CMSManager/CMSManager.util';
import { ResponseTableColumn } from './CMSResponseTable.constant';
import { CMSResponseTableTypeCell } from './CMSResponseTableTypeCell/CMSResponseTableTypeCell.component';
import { CMSResponseTableUsedByCell } from './CMSResponseTableUsedByCell.component';
import { CMSResponseTableVariantCell } from './CMSResponseTableVariantCell/CMSResponseTableVariantCell.component';

export const CMS_RESPONSE_TABLE_CONFIG: TableConfig<ResponseTableColumn, CMSFolder | CMSResponse> = {
  columns: {
    [ResponseTableColumn.SELECT]: {
      type: ResponseTableColumn.SELECT,
      name: 'Select',
      cell: ({ item }) => <Table.Cell.Select item={item} />,
      header: () => <Table.Header.Cell.Select />,
    },

    [ResponseTableColumn.ALL]: {
      type: ResponseTableColumn.ALL,
      name: 'All responses',
      sorter: withFolderSort<CMSResponse>(withFieldLocaleCompareSort('name')),

      cell: ({ item, type }) =>
        item.group ? (
          <CMSTableNameCell type={type} name={item.name} isFolder={item.group} itemID={item.id} />
        ) : (
          <CMSResponseTableVariantCell response={item} />
        ),
    },

    [ResponseTableColumn.ATTACHMENTS]: {
      type: ResponseTableColumn.ATTACHMENTS,
      name: 'Attachments',
      cell: () => <Table.Cell.Empty />,
    },

    [ResponseTableColumn.TYPE]: {
      type: ResponseTableColumn.TYPE,
      name: 'Type',
      cell: ({ item }) => (
        <CMSResponseTableTypeCell
          responseID={item.id}
          language={Language.ENGLISH_US}
          channel={Channel.DEFAULT}
          isFolder={item.group}
        />
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
