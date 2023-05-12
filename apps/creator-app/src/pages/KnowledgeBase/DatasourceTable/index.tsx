import { Table } from '@voiceflow/ui';
import React from 'react';

import EmptyScreen from '@/components/EmptyScreen';

import { KnowledgeBaseContext } from '../context';
import { COLUMNS, TableColumn } from './constants';
import Row from './Row';

const DatasourceTable: React.FC = () => {
  const { state } = React.useContext(KnowledgeBaseContext);

  const { items, orderBy, descending, onChangeOrderBy } = Table.useFilterOrderItems({
    items: state.documents,
    columns: COLUMNS,
    // filterBy: [search],
    initialOrderBy: TableColumn.DATE,
    isDescending: true,
    getItemFilterBy: (item) => [item.data.name],
  });

  return (
    <>
      <Table.Configurable
        empty={<EmptyScreen body="Upload text, PDF, URLs, and create a Chat-GPT like agent experience." title="No data sources exist" />}
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
    </>
  );
};

export default DatasourceTable;
