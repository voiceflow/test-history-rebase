import { Table, type TableConfig, Text, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

import type { CMSKnowledgeBase } from '@/pages/AssistantCMS/contexts/CMSManager/CMSManager.interface';

import { sortByDate, sortByName } from '../../CMSKnowledgeBase.util';
import { KnowledgeBaseTableColumn } from './CMSKnowledgeBaseTable.constant';
import { typeText } from './CMSKnowledgeBaseTable.css';
import { CMSKnowledgeBaseSelectCell } from './components/CMSKnowledgeBaseSelectCell.component';
import { DocumentNameCell } from './components/CMSKnowledgeBaseTableDocumentNameCell.component';
import { DocumentRefresh } from './components/CMSKnowledgeBaseTableRefresh/CMSKnowledgeBaseTableRefresh.component';
import { Status } from './components/CMSKnowledgeBaseTableStatusCell.component';

export const CMS_KNOWLEDGE_BASE_TABLE_CONFIG: TableConfig<KnowledgeBaseTableColumn, CMSKnowledgeBase> = {
  columns: {
    [KnowledgeBaseTableColumn.SELECT]: {
      type: KnowledgeBaseTableColumn.SELECT,
      name: 'Select',
      cell: ({ item }) => <CMSKnowledgeBaseSelectCell item={item} />,
      header: () => <Table.Header.Cell.Select />,
    },

    [KnowledgeBaseTableColumn.NAME]: {
      type: KnowledgeBaseTableColumn.NAME,
      name: 'Name',

      cell: ({ item, type }) => <DocumentNameCell type={type} item={item} />,

      sorter: sortByName,
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

      cell: ({ item }) => (
        <Table.Cell.GroupEmpty
          item={item}
          label={(item) => (
            <Table.Cell.FromNow
              date={item.updatedAt.toString()}
              label={({ label }) => (
                <Tooltip.Overflow
                  referenceElement={({ ref, onOpen, onClose }) => (
                    <Table.Cell.Text ref={ref} label={label} onMouseEnter={onOpen} onMouseLeave={onClose} overflow />
                  )}
                >
                  {() => <Text breakWord>{label}</Text>}
                </Tooltip.Overflow>
              )}
            />
          )}
        />
      ),

      sorter: sortByDate,
    },

    [KnowledgeBaseTableColumn.STATUS]: {
      type: KnowledgeBaseTableColumn.STATUS,
      name: 'Status',

      cell: ({ item }) => <Status item={item} />,
    },

    [KnowledgeBaseTableColumn.REFRESH]: {
      type: KnowledgeBaseTableColumn.REFRESH,
      name: 'Refresh',

      cell: ({ item }) => <DocumentRefresh item={item} />,
    },
  },
};
