import { Table, type TableConfig } from '@voiceflow/ui-next';
import React from 'react';

import type { CMSFolder, CMSKnowledgeBase } from '../../../../contexts/CMSManager/CMSManager.interface';
import { KnowledgeBaseTableColumn } from './CMSKnowledgeBaseTable.constant';

export const CMS_KNOWLEDGE_BASE_TABLE_CONFIG: TableConfig<KnowledgeBaseTableColumn, CMSFolder | CMSKnowledgeBase> = {
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

      cell: () => <Table.Cell.Empty />,
    },

    [KnowledgeBaseTableColumn.TYPE]: {
      type: KnowledgeBaseTableColumn.TYPE,
      name: 'Type',

      cell: () => <Table.Cell.Empty />,
    },

    [KnowledgeBaseTableColumn.STATUS]: {
      type: KnowledgeBaseTableColumn.STATUS,
      name: 'Status',

      cell: () => <Table.Cell.Empty />,
    },

    [KnowledgeBaseTableColumn.DATE]: {
      type: KnowledgeBaseTableColumn.DATE,
      name: 'Date',

      cell: () => <Table.Cell.Empty />,
    },
  },
};
