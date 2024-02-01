import { Table, type TableConfig } from '@voiceflow/ui-next';
import React from 'react';

import { transformVariableName } from '@/utils/variable.util';

import { CMSTableCellFromNowTooltip } from '../../../../components/CMSTableCellFromNowTooltip/CMSTableCellFromNowTooltip.component';
import { CMSTableCellTextTooltip } from '../../../../components/CMSTableCellTextTooltip/CMSTableCellTextTooltip.component';
import { CMSTableLastEditedCell } from '../../../../components/CMSTableLastEditedCell/CMSTableLastEditedCell.component';
import { CMSTableNameCell } from '../../../../components/CMSTableNameCell/CMSTableNameCell.component';
import type { CMSEntity, CMSFolder } from '../../../../contexts/CMSManager/CMSManager.interface';
import { localeCompareSort, updatedAtSort, withFieldLocaleCompareSort, withFolderSort } from '../../../../contexts/CMSManager/CMSManager.util';
import { CMSEntitySortContext } from '../../CMSEntity.interface';
import { EntityTableColumn } from './CMSEntityTable.constant';
import { CMSEntityTableClassifierCell } from './CMSEntityTableClassifierCell/CMSEntityTableClassifierCell.component';

export const CMS_ENTITY_TABLE_CONFIG: TableConfig<EntityTableColumn, CMSFolder | CMSEntity, CMSEntitySortContext> = {
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
      sorter: withFolderSort<CMSEntity>(withFieldLocaleCompareSort('name')),

      cell: ({ item, type }) => <CMSTableNameCell type={type} name={item.name} itemID={item.id} nameTransform={transformVariableName} />,
    },

    [EntityTableColumn.DESCRIPTION]: {
      type: EntityTableColumn.DESCRIPTION,
      name: 'Description',
      sorter: withFolderSort<CMSEntity>(withFieldLocaleCompareSort('description')),

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
      sorter: withFolderSort<CMSEntity, CMSEntitySortContext>((left, right, { context }) =>
        localeCompareSort(
          left.classifier ? context.entityClassifiersMap[left.classifier]?.label ?? 'Custom' : 'Custom',
          right.classifier ? context.entityClassifiersMap[right.classifier]?.label ?? 'Custom' : 'Custom'
        )
      ),

      cell: ({ item }) => <Table.Cell.GroupEmpty item={item} label={({ classifier }) => <CMSEntityTableClassifierCell classifier={classifier} />} />,
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

      cell: ({ item }) => <Table.Cell.GroupEmpty item={item} label={({ updatedAt }) => <CMSTableCellFromNowTooltip updatedAt={updatedAt} />} />,
    },
  },
};
