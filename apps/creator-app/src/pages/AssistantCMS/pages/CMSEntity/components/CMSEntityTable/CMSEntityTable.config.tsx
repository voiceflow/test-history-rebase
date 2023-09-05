import { Table, type TableConfig } from '@voiceflow/ui-next';
import React from 'react';

import { CMSTableCellFromNowTooltip } from '../../../../components/CMSTableCellFromNowTooltip';
import { CMSTableCellTextTooltip } from '../../../../components/CMSTableCellTextTooltip';
import { CMSTableLastEditedCell } from '../../../../components/CMSTableLastEditedCell/CMSTableLastEditedCell.component';
import { CMSTableNameCell } from '../../../../components/CMSTableNameCell';
import type { CMSEntity, CMSFolder } from '../../../../contexts/CMSManager/CMSManager.interface';
import { updatedAtSort, withFolderSort, withLocaleCompareSort } from '../../../../contexts/CMSManager/CMSManager.util';
import { EntityTableColumn } from './CMSEntityTable.constant';

export const CMS_ENTITY_TABLE_CONFIG: TableConfig<EntityTableColumn, CMSFolder | CMSEntity> = {
  columns: {
    [EntityTableColumn.SELECT]: {
      type: EntityTableColumn.SELECT,
      name: 'Select',
      cell: ({ item }) => <Table.Cell.Select item={item} />,
      header: () => <Table.Header.Cell.Select />,
    },

    [EntityTableColumn.NAME]: {
      type: EntityTableColumn.NAME,
      name: 'Name',
      sorter: withFolderSort<CMSEntity>(withLocaleCompareSort('name')),

      cell: ({ item, type }) => <CMSTableNameCell itemID={item.id} label={item.name} type={type} />,
    },

    [EntityTableColumn.DESCRIPTION]: {
      type: EntityTableColumn.DESCRIPTION,
      name: 'Description',
      sorter: withFolderSort<CMSEntity>(withLocaleCompareSort('description')),

      cell: ({ item }) => (
        <Table.Cell.GroupEmpty
          item={item}
          label={(item) => (item.description ? <CMSTableCellTextTooltip label={item.description} /> : <Table.Cell.Empty />)}
        />
      ),
    },

    [EntityTableColumn.TYPE]: {
      type: EntityTableColumn.TYPE,
      name: 'Data type',
      sorter: withFolderSort<CMSEntity>(withLocaleCompareSort('classifier')),

      cell: ({ item }) => <Table.Cell.GroupEmpty item={item} label={(item) => <CMSTableCellTextTooltip label={item.classifier ?? 'custom'} />} />,
    },

    [EntityTableColumn.LAST_EDITOR]: {
      type: EntityTableColumn.LAST_EDITOR,
      name: 'Last editor',

      cell: ({ item }) => <Table.Cell.GroupEmpty item={item} label={({ updatedByID }) => <CMSTableLastEditedCell creatorID={updatedByID} />} />,
    },

    [EntityTableColumn.UPDATED]: {
      type: EntityTableColumn.UPDATED,
      name: 'Updated',
      sorter: withFolderSort(updatedAtSort),

      cell: ({ item }) => <CMSTableCellFromNowTooltip updatedAt={item.updatedAt} />,
    },
  },
};
