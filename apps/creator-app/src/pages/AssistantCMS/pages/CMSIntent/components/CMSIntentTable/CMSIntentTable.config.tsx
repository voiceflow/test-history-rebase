import { Table, type TableConfig } from '@voiceflow/ui-next';
import React from 'react';

import { CMSTableCellFromNowTooltip } from '../../../../components/CMSTableCellFromNowTooltip';
import { CMSTableLastEditedCell } from '../../../../components/CMSTableLastEditedCell/CMSTableLastEditedCell.component';
import { CMSTableNameCell } from '../../../../components/CMSTableNameCell';
import type { CMSFolder, CMSIntent } from '../../../../contexts/CMSManager/CMSManager.interface';
import { updatedAtSort, withFolderSort, withLocaleCompareSort } from '../../../../contexts/CMSManager/CMSManager.util';
import { IntentTableColumn } from './CMSIntentTable.constant';
import { CMSIntentTableConfidenceCell } from './CMSIntentTableConfidenceCell/CMSIntentTableConfidenceCell.component';

export const INTENTS_TABLE_CONFIG: TableConfig<IntentTableColumn, CMSFolder | CMSIntent> = {
  columns: {
    [IntentTableColumn.SELECT]: {
      type: IntentTableColumn.SELECT,
      name: 'Select',
      cell: ({ item }) => <Table.Cell.Select item={item} />,
      header: () => <Table.Header.Cell.Select />,
    },

    [IntentTableColumn.NAME]: {
      type: IntentTableColumn.NAME,
      name: 'Name',
      sorter: withFolderSort<CMSIntent>(withLocaleCompareSort('name')),

      cell: ({ item, type }) => <CMSTableNameCell itemID={item.id} label={item.name} type={type} />,
    },

    [IntentTableColumn.CLARITY]: {
      type: IntentTableColumn.CLARITY,
      name: 'Clarity',
      cell: ({ item }) => <Table.Cell.GroupEmpty item={item} label={() => <Table.Cell.Text label="to do" overflow />} />,
    },

    [IntentTableColumn.CONFIDENCE]: {
      type: IntentTableColumn.CONFIDENCE,
      name: 'Confidence',
      cell: ({ item }) => <Table.Cell.GroupEmpty item={item} label={() => <CMSIntentTableConfidenceCell intentID={item.id} />} />,
    },

    [IntentTableColumn.FLOWS]: {
      type: IntentTableColumn.FLOWS,
      name: 'Flows using',
      cell: ({ item }) => <Table.Cell.GroupEmpty item={item} label={() => <Table.Cell.Text label="to do" overflow />} />,
    },

    [IntentTableColumn.LAST_EDITOR]: {
      type: IntentTableColumn.LAST_EDITOR,
      name: 'Last editor',
      cell: ({ item }) => <Table.Cell.GroupEmpty item={item} label={({ updatedByID }) => <CMSTableLastEditedCell creatorID={updatedByID} />} />,
    },

    [IntentTableColumn.UPDATED]: {
      type: IntentTableColumn.UPDATED,
      name: 'Updated',
      sorter: withFolderSort(updatedAtSort),

      cell: ({ item }) => <CMSTableCellFromNowTooltip updatedAt={item.updatedAt} />,
    },
  },
};
