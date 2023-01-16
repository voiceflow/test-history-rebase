import { Table } from '@voiceflow/ui';
import React from 'react';

import { useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';
import { useTableHotkeys } from '@/pages/NLUManager/hooks';

import { useNLUManager } from '../../context';
import { EditSidebar, EmptyScreen, EntityTableToolbar, Row } from './components';
import { COLUMNS, TableColumn } from './constants';

const EntityTable: React.OldFC = () => {
  const nluManager = useNLUManager();
  const search = React.useMemo(() => [nluManager.search], [nluManager.search]);

  const { items, orderBy, descending, onChangeOrderBy } = Table.useFilterOrderItems({
    items: nluManager.entities,
    columns: COLUMNS,
    filterBy: search,
    initialOrderBy: TableColumn.NAME,
    getItemFilterBy: (item) => [item.name],
  });

  const selectAllItems = () => {
    nluManager.setSelectedEntityIDs(nluManager.entities.map((e) => e.id));
  };

  useTableHotkeys(items);
  useHotKeys(Hotkey.SELECT_ALL, selectAllItems, { action: 'keyup' });

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
      <EntityTableToolbar />
    </>
  );
};

export default EntityTable;
