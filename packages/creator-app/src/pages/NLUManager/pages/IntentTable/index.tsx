import { Table } from '@voiceflow/ui';
import React from 'react';

import { EmptyScreen } from '@/pages/NLUManager/components';
import { useNLUManager } from '@/pages/NLUManager/context';
import { useTableHotkeys } from '@/pages/NLUManager/hooks';

import { NLUIntent } from '../../types';
import { EditSidebar, Row } from './components';
import { COLUMNS, TableColumn } from './constants';

const IntentTable: React.FC = () => {
  const nluManager = useNLUManager<NLUIntent>();

  const { items, orderBy, descending, onChangeOrderBy } = Table.useFilterOrderItems({
    items: nluManager.items,
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
