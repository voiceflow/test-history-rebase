import { BaseModels } from '@voiceflow/base-types';
import { Table, type TableConfig } from '@voiceflow/ui-next';
import React from 'react';

import type { CMSFolder, CMSKnowledgeBase } from '@/pages/AssistantCMS/contexts/CMSManager/CMSManager.interface';

import { CMSTableCellFromNowTooltip } from '../../../../components/CMSTableCellFromNowTooltip/CMSTableCellFromNowTooltip.component';
import { updatedAtSort, withFolderSort } from '../../../../contexts/CMSManager/CMSManager.util';
import { sortByName, sortByStatus } from '../../CMSKnowledgeBase.util';
import { KnowledgeBaseTableColumn } from './CMSKnowledgeBaseTable.constant';
import { CMSKnowledgeBaseTableImportedByCell } from './CMSKnowledgeBaseTableImportedByCell/CMSKnowledgeBaseTableImportedByCell.component';
import { CMSKnowledgeBaseTableNameCell } from './CMSKnowledgeBaseTableNameCell/CMSKnowledgeBaseTableNameCell.component';
import { CMSKnowledgeBaseTableRefreshCell } from './CMSKnowledgeBaseTableRefreshCell/CMSKnowledgeBaseTableRefreshCell.component';
import { Status } from './CMSKnowledgeBaseTableStatusCell/CMSKnowledgeBaseTableStatusCell.component';

export const CMS_KNOWLEDGE_BASE_TABLE_CONFIG: TableConfig<KnowledgeBaseTableColumn, CMSKnowledgeBase | CMSFolder> = {
  columns: {
    [KnowledgeBaseTableColumn.SELECT]: {
      type: KnowledgeBaseTableColumn.SELECT,
      name: 'Select',
      cell: ({ item }) => <Table.Cell.Select item={item} />,
      header: () => <Table.Header.Cell.Select />,
    },

    [KnowledgeBaseTableColumn.NAME]: {
      type: KnowledgeBaseTableColumn.NAME,
      name: 'Data source',
      sorter: withFolderSort<CMSKnowledgeBase>(sortByName),

      cell: ({ item }) => (
        <Table.Cell.GroupEmpty item={item} label={(item) => <CMSKnowledgeBaseTableNameCell item={item} />} />
      ),
    },

    [KnowledgeBaseTableColumn.IMPORTED_BY]: {
      type: KnowledgeBaseTableColumn.IMPORTED_BY,
      name: 'Imported by',

      cell: ({ item }) => (
        <Table.Cell.GroupEmpty
          item={item}
          label={({ creatorID }) => <CMSKnowledgeBaseTableImportedByCell creatorID={creatorID} />}
        />
      ),
    },

    [KnowledgeBaseTableColumn.DATE]: {
      type: KnowledgeBaseTableColumn.DATE,
      name: 'Date',
      sorter: withFolderSort(updatedAtSort),

      cell: ({ item }) => {
        return (
          <Table.Cell.GroupEmpty
            item={item}
            label={({ updatedAt, data }) => {
              if (data?.type === BaseModels.Project.KnowledgeBaseDocumentType.URL) {
                return <CMSTableCellFromNowTooltip updatedAt={data.lastSuccessUpdate || updatedAt.toString()} />;
              }

              return <CMSTableCellFromNowTooltip updatedAt={updatedAt.toString()} />;
            }}
          />
        );
      },
    },

    [KnowledgeBaseTableColumn.STATUS]: {
      type: KnowledgeBaseTableColumn.STATUS,
      name: 'Status',
      sorter: withFolderSort<CMSKnowledgeBase>(sortByStatus),

      cell: ({ item }) => <Table.Cell.GroupEmpty item={item} label={(item) => <Status item={item} />} />,
    },

    [KnowledgeBaseTableColumn.REFRESH]: {
      type: KnowledgeBaseTableColumn.REFRESH,
      name: 'Refresh',

      cell: ({ item }) => (
        <Table.Cell.GroupEmpty item={item} label={(item) => <CMSKnowledgeBaseTableRefreshCell item={item} />} />
      ),
    },
  },
};
