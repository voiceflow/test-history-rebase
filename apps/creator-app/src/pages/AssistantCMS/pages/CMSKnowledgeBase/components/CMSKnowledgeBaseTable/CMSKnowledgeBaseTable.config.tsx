import { Table, type TableConfig, Text, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

import type { CMSKnowledgeBase } from '@/pages/AssistantCMS/contexts/CMSManager/CMSManager.interface';

import { sortByDate, sortByName } from '../../CMSKnowledgeBase.util';
import { KnowledgeBaseTableColumn } from './CMSKnowledgeBaseTable.constant';
import { typeText } from './CMSKnowledgeBaseTable.css';
import { Status } from './components/CMSKnowledgeBaseTableStatusCell.component';

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

      cell: ({ item, type }) => (
        <Table.Cell.GroupName
          type={type}
          item={item}
          label={({ data }) => (
            <Tooltip.Overflow
              referenceElement={({ ref, onOpen, onClose }) => (
                <Table.Cell.Text label={data.name} ref={ref} overflow onMouseEnter={onOpen} onMouseLeave={onClose}></Table.Cell.Text>
              )}
            >
              {() => <Text breakWord>{data.name}</Text>}
            </Tooltip.Overflow>
          )}
          count={({ count }) => <Table.Cell.Count count={count} />}
        />
      ),

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

    [KnowledgeBaseTableColumn.STATUS]: {
      type: KnowledgeBaseTableColumn.STATUS,
      name: 'Status',

      cell: ({ item }) => <Status item={item} />,
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
  },
};
