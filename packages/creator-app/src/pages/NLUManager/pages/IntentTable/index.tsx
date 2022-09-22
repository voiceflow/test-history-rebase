import { Table } from '@voiceflow/ui';
import React from 'react';

import { useNLUManager } from '@/pages/NLUManager/context';
import { useTableHotkeys } from '@/pages/NLUManager/hooks';

import { EditSidebar, Row } from './components';
import EmptyScreen from './components/EmptyScreen';
import { COLUMNS, TableColumn } from './constants';

const IntentTable: React.FC = () => {
  const nluManager = useNLUManager();

  const { items, orderBy, descending, onChangeOrderBy } = Table.useFilterOrderItems({
    items: nluManager.intents,
    columns: COLUMNS,
    filterBy: nluManager.search,
    initialOrderBy: TableColumn.NAME,
    getItemFilterBy: (item) => item.name,
  });

  useTableHotkeys(items);

  return (
    <>
      <Table.Configurable
        empty={<EmptyScreen />}
        items={items}
        orderBy={orderBy}
        columns={COLUMNS}
        renderRow={(props) => <Row {...props} items={items} />}
        descending={descending}
        onChangeOrderBy={onChangeOrderBy}
        scrolled={nluManager.isScrolling}
      />

      <EditSidebar />
    </>
  );
};

export default IntentTable;
