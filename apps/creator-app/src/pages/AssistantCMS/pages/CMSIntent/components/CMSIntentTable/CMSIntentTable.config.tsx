import { Table, type TableConfig } from '@voiceflow/ui-next';
import React from 'react';

import { CMSTableCellFromNowTooltip } from '../../../../components/CMSTableCellFromNowTooltip/CMSTableCellFromNowTooltip.component';
import { CMSTableCellTextTooltip } from '../../../../components/CMSTableCellTextTooltip/CMSTableCellTextTooltip.component';
import { CMSTableMemberCell } from '../../../../components/CMSTableMemberCell/CMSTableMemberCell.component';
import { CMSTableNameCell } from '../../../../components/CMSTableNameCell/CMSTableNameCell.component';
import type { CMSFolder, CMSIntent } from '../../../../contexts/CMSManager/CMSManager.interface';
import {
  updatedAtSort,
  withFieldLocaleCompareSort,
  withFolderSort,
} from '../../../../contexts/CMSManager/CMSManager.util';
import type { CMSIntentSortContext } from '../../CMSIntent.interface';
import { IntentTableColumn } from './CMSIntentTable.constant';
import { CMSIntentTableConfidenceCell } from './CMSIntentTableConfidenceCell/CMSIntentTableConfidenceCell.component';
import { CMSIntentTableUsedByCell } from './CMSIntentTableUsedByCell.component';

export const INTENTS_TABLE_CONFIG: TableConfig<IntentTableColumn, CMSFolder | CMSIntent, CMSIntentSortContext> = {
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
      sorter: withFolderSort<CMSIntent>(withFieldLocaleCompareSort('name')),

      cell: ({ item, type }) => (
        <CMSTableNameCell type={type} name={item.name} isFolder={item.group} itemID={item.id} />
      ),
    },

    [IntentTableColumn.DESCRIPTION]: {
      type: IntentTableColumn.DESCRIPTION,
      name: 'Description',
      sorter: withFolderSort<CMSIntent>(withFieldLocaleCompareSort('description')),

      cell: ({ item }) => (
        <Table.Cell.GroupEmpty
          item={item}
          label={(item) =>
            item.description ? <CMSTableCellTextTooltip label={item.description} /> : <Table.Cell.Empty />
          }
        />
      ),
    },

    [IntentTableColumn.CLARITY]: {
      type: IntentTableColumn.CLARITY,
      name: 'Clarity',
      cell: ({ item }) => (
        <Table.Cell.GroupEmpty item={item} label={() => <Table.Cell.Text label="to do" overflow />} />
      ),
    },

    [IntentTableColumn.CONFIDENCE]: {
      type: IntentTableColumn.CONFIDENCE,
      name: 'Confidence',
      cell: ({ item }) => (
        <Table.Cell.GroupEmpty item={item} label={() => <CMSIntentTableConfidenceCell intentID={item.id} />} />
      ),
      sorter: withFolderSort(
        (left, right, { context }) =>
          (context.notEmptyUtterancesCountByIntentID[left.id] ?? 0) -
          (context.notEmptyUtterancesCountByIntentID[right.id] ?? 0)
      ),
    },

    [IntentTableColumn.FLOWS]: {
      type: IntentTableColumn.FLOWS,
      name: 'Flows using',
      cell: ({ item }) => (
        <Table.Cell.GroupEmpty item={item} label={() => <Table.Cell.Text label="to do" overflow />} />
      ),
    },

    [IntentTableColumn.USED_BY]: {
      type: IntentTableColumn.USED_BY,
      name: 'Used by',

      cell: ({ item }) => (
        <Table.Cell.GroupEmpty item={item} label={(item) => <CMSIntentTableUsedByCell intentID={item.id} />} />
      ),
    },

    [IntentTableColumn.LAST_EDITOR]: {
      type: IntentTableColumn.LAST_EDITOR,
      name: 'Last editor',
      cell: ({ item }) => (
        <Table.Cell.GroupEmpty
          item={item}
          label={({ updatedByID }) => <CMSTableMemberCell creatorID={updatedByID} />}
        />
      ),
    },

    [IntentTableColumn.UPDATED]: {
      type: IntentTableColumn.UPDATED,
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
