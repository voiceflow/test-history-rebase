import { Table, type TableConfig, Text } from '@voiceflow/ui-next';
import React from 'react';

import type { CMSKnowledgeBase } from '@/pages/AssistantCMS/contexts/CMSManager/CMSManager.interface';

import { CMSTableCellFromNowTooltip } from '../../../../components/CMSTableCellFromNowTooltip/CMSTableCellFromNowTooltip.component';
import { updatedAtSort, withFolderSort } from '../../../../contexts/CMSManager/CMSManager.util';
import { sortByName } from '../../CMSKnowledgeBase.util';
import { KnowledgeBaseTableColumn } from './CMSKnowledgeBaseTable.constant';
import { typeText } from './CMSKnowledgeBaseTable.css';
import { DocumentNameCell } from './components/CMSKnowledgeBaseDocumentNameCell/CMSKnowledgeBaseTableDocumentNameCell.component';
import { ImportedByName } from './components/CMSKnowledgeBaseImportedByCell.component';
import { Status } from './components/CMSKnowledgeBaseStatusCell/CMSKnowledgeBaseTableStatusCell.component';
import { DocumentRefresh } from './components/CMSKnowledgeBaseTableRefresh/CMSKnowledgeBaseTableRefresh.component';

export const CMS_KNOWLEDGE_BASE_TABLE_CONFIG: TableConfig<KnowledgeBaseTableColumn, CMSKnowledgeBase> = {
  columns: {
    [KnowledgeBaseTableColumn.SELECT]: {
      type: KnowledgeBaseTableColumn.SELECT,
      name: 'Select',
      cell: ({ item }) => <Table.Cell.Select item={item} />,
      header: () => <Table.Header.Cell.Select />,
    },

    [KnowledgeBaseTableColumn.NAME]: {
      type: KnowledgeBaseTableColumn.NAME,
      name: 'Name',
      sorter: withFolderSort<CMSKnowledgeBase>(sortByName),

      cell: ({ item }) => <Table.Cell.GroupEmpty item={item} label={(item) => <DocumentNameCell item={item} />} />,
    },

    [KnowledgeBaseTableColumn.IMPORTED_BY]: {
      type: KnowledgeBaseTableColumn.IMPORTED_BY,
      name: 'Imported by',

      cell: ({ item }) => (
        <Table.Cell.GroupEmpty item={item} label={({ creatorID }) => (creatorID ? <ImportedByName creatorID={creatorID} /> : <Table.Cell.Empty />)} />
      ),
    },

    [KnowledgeBaseTableColumn.TYPE]: {
      type: KnowledgeBaseTableColumn.TYPE,
      name: 'Type',

      cell: ({ item }) => (
        <Table.Cell.GroupEmpty
          item={item}
          label={(item) => (
            <Text breakWord className={typeText}>
              {item.data.type.toUpperCase()}
            </Text>
          )}
        />
      ),
    },

    [KnowledgeBaseTableColumn.DATE]: {
      type: KnowledgeBaseTableColumn.DATE,
      name: 'Date',

      cell: ({ item }) => <CMSTableCellFromNowTooltip updatedAt={item.updatedAt.toString()} />,

      sorter: withFolderSort(updatedAtSort),
    },

    [KnowledgeBaseTableColumn.STATUS]: {
      type: KnowledgeBaseTableColumn.STATUS,
      name: 'Status',

      cell: ({ item }) => <Table.Cell.GroupEmpty item={item} label={(item) => <Status item={item} />} />,
    },

    [KnowledgeBaseTableColumn.REFRESH]: {
      type: KnowledgeBaseTableColumn.REFRESH,
      name: 'Refresh',

      cell: ({ item }) => <Table.Cell.GroupEmpty item={item} label={(item) => <DocumentRefresh item={item} />} />,
    },
  },
};
