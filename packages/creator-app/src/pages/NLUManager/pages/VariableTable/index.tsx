import { Table } from '@voiceflow/ui';
import React from 'react';

import { OrderedVariable } from '@/hooks';
import { EmptyScreen } from '@/pages/NLUManager/components';
import { useNLUManager } from '@/pages/NLUManager/context';
import { useTableHotkeys } from '@/pages/NLUManager/hooks';

import { Row } from './components';
import { COLUMNS, TableColumn } from './constants';

const EntityTable: React.FC = () => {
  const nluManager = useNLUManager<OrderedVariable>();

  const { items, orderBy, descending, onChangeOrderBy } = Table.useFilterOrderItems({
    items: nluManager.items,
    columns: COLUMNS,
    filterBy: nluManager.search,
    initialOrderBy: TableColumn.NAME,
    getItemFilterBy: (item) => item.name,
  });

  useTableHotkeys(items);

  return (
    <Table.Configurable
      empty={<EmptyScreen />}
      items={items}
      orderBy={orderBy}
      columns={COLUMNS}
      renderRow={(props) => <Row {...props} />}
      descending={descending}
      onChangeOrderBy={onChangeOrderBy}
      scrolled={nluManager.isScrolling}
    />
  );
};

export default EntityTable;
