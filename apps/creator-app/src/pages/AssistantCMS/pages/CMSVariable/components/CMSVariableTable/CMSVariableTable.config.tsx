import { Table, type TableConfig } from '@voiceflow/ui-next';
import React from 'react';

import { transformVariableName } from '@/utils/variable.util';

import { CMSTableCellFromNowTooltip } from '../../../../components/CMSTableCellFromNowTooltip/CMSTableCellFromNowTooltip.component';
import { CMSTableCellTextTooltip } from '../../../../components/CMSTableCellTextTooltip/CMSTableCellTextTooltip.component';
import { CMSTableLastEditedCell } from '../../../../components/CMSTableLastEditedCell/CMSTableLastEditedCell.component';
import { CMSTableNameCell } from '../../../../components/CMSTableNameCell/CMSTableNameCell.component';
import type { CMSFolder, CMSVariable } from '../../../../contexts/CMSManager/CMSManager.interface';
import { updatedAtSort, withFieldLocaleCompareSort, withFolderSort } from '../../../../contexts/CMSManager/CMSManager.util';
import { VariableTableColumn } from './CMSVariableTable.constant';

export const CMS_VARIABLE_TABLE_CONFIG: TableConfig<VariableTableColumn, CMSFolder | CMSVariable> = {
  columns: {
    [VariableTableColumn.SELECT]: {
      type: VariableTableColumn.SELECT,
      name: 'Select',
      cell: ({ item }) => <Table.Cell.Select item={item} />,
      header: () => <Table.Header.Cell.Select />,
    },

    [VariableTableColumn.NAME]: {
      type: VariableTableColumn.NAME,
      name: 'Name',
      sorter: withFolderSort<CMSVariable>(withFieldLocaleCompareSort('name')),

      cell: ({ item, type }) => <CMSTableNameCell type={type} name={item.name} itemID={item.id} nameTransform={transformVariableName} />,
    },

    [VariableTableColumn.DESCRIPTION]: {
      type: VariableTableColumn.DESCRIPTION,
      name: 'Description',
      sorter: withFolderSort<CMSVariable>(withFieldLocaleCompareSort('description')),

      cell: ({ item }) => (
        <Table.Cell.GroupEmpty
          item={item}
          label={(item) => (item.description ? <CMSTableCellTextTooltip label={item.description} /> : <Table.Cell.Empty />)}
        />
      ),
    },

    [VariableTableColumn.DEFAULT_VALUE]: {
      type: VariableTableColumn.DEFAULT_VALUE,
      name: 'Default value',
      sorter: withFolderSort<CMSVariable>(withFieldLocaleCompareSort('defaultValue')),

      cell: ({ item }) => (
        <Table.Cell.GroupEmpty
          item={item}
          label={(item) => (item.defaultValue ? <CMSTableCellTextTooltip label={item.defaultValue} /> : <Table.Cell.Empty />)}
        />
      ),
    },

    [VariableTableColumn.LAST_EDITOR]: {
      type: VariableTableColumn.LAST_EDITOR,
      name: 'Last editor',

      cell: ({ item }) => <Table.Cell.GroupEmpty item={item} label={({ updatedByID }) => <CMSTableLastEditedCell creatorID={updatedByID} />} />,
    },

    [VariableTableColumn.UPDATED]: {
      type: VariableTableColumn.UPDATED,
      name: 'Updated',
      sorter: withFolderSort(updatedAtSort),

      cell: ({ item }) => <Table.Cell.GroupEmpty item={item} label={({ updatedAt }) => <CMSTableCellFromNowTooltip updatedAt={updatedAt} />} />,
    },
  },
};
