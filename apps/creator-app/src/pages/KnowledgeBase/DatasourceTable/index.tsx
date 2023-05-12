import { Table } from '@voiceflow/ui';
import React from 'react';

import EmptyScreen from '@/components/EmptyScreen';
import { LEARN_KNOWLEDGE_BASE } from '@/constants';

import { KnowledgeBaseContext } from '../context';
import { KnowledgeBaseToolbar } from './components';
import { COLUMNS, TableColumn } from './constants';
import Row from './Row';

const DatasourceTable: React.FC = () => {
  const { state } = React.useContext(KnowledgeBaseContext);

  const { items, orderBy, descending, onChangeOrderBy } = Table.useFilterOrderItems({
    items: state.documents,
    columns: COLUMNS,
    initialOrderBy: TableColumn.DATE,
    isDescending: true,
    getItemFilterBy: (item) => [item.data.name],
  });

  return (
    <>
      <Table.Configurable
        empty={
          <EmptyScreen
            body="Upload text, PDF, URLs, and create a Chat-GPT like agent experience."
            title="No data sources exist"
            documentation={LEARN_KNOWLEDGE_BASE}
          />
        }
        items={items}
        orderBy={orderBy}
        columns={COLUMNS}
        renderRow={(props) => <Row {...props} />}
        descending={descending}
        onChangeOrderBy={onChangeOrderBy}
        header={
          <Table.Header>
            {COLUMNS.map(({ type, flex, label, width, sorter, tooltip }) => (
              <Table.Header.Column
                key={type}
                flex={flex}
                width={width}
                active={type === orderBy}
                tooltip={tooltip}
                onClick={() => sorter && onChangeOrderBy?.(type)}
                sortable={!!sorter}
                descending={descending}
              >
                {label}
              </Table.Header.Column>
            ))}
          </Table.Header>
        }
      />
      <KnowledgeBaseToolbar />
    </>
  );
};

export default DatasourceTable;
