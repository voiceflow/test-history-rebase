import { Table } from '@voiceflow/ui';
import React from 'react';

import { useTableHotkeys } from '@/pages/NLUManager/hooks';

import { useNLUManager } from '../../context';
import { EditSidebar, Row } from './components';
import EmptyScreen from './components/EmptyScreen';
import { COLUMNS, TableColumn } from './constants';

const EntityTable: React.FC = () => {
  const nluManager = useNLUManager();
  const search = React.useMemo(() => [nluManager.search], [nluManager.search]);

  const { items, orderBy, descending, onChangeOrderBy } = Table.useFilterOrderItems({
    items: nluManager.entities,
    columns: COLUMNS,
    filterBy: search,
    initialOrderBy: TableColumn.NAME,
    getItemFilterBy: (item) => [item.name],
  });

  useTableHotkeys(items);

  return (
    <>
      <Table.Configurable
        empty={<EmptyScreen />}
        items={items}
        orderBy={orderBy}
        columns={COLUMNS}
        renderRow={(props) => <Row {...props} />}
        scrolled={nluManager.isScrolling}
        descending={descending}
        onChangeOrderBy={onChangeOrderBy}
      />

      <EditSidebar />
    </>
  );
};

export default EntityTable;
