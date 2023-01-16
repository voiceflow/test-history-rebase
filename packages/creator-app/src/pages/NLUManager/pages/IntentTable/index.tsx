import { Table } from '@voiceflow/ui';
import React from 'react';

import { useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';
import { useNLUManager } from '@/pages/NLUManager/context';
import { useTableHotkeys } from '@/pages/NLUManager/hooks';

import { EditSidebar, EmptyScreen, IntentTableToolbar, Row } from './components';
import { COLUMNS, TableColumn } from './constants';

const IntentTable: React.OldFC = () => {
  const nluManager = useNLUManager();
  const search = React.useMemo(() => [nluManager.search], [nluManager.search]);

  const { items, orderBy, descending, onChangeOrderBy } = Table.useFilterOrderItems({
    items: nluManager.intents,
    columns: COLUMNS,
    filterBy: search,
    initialOrderBy: TableColumn.NAME,
    getItemFilterBy: (item) => [item.name],
  });

  const selectAllItems = () => {
    nluManager.setSelectedIntentIDs(nluManager.intents.map((i) => i.id));
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
        scrolled={nluManager.isScrolling}
        renderRow={(props) => <Row {...props} />}
        descending={descending}
        onChangeOrderBy={onChangeOrderBy}
      />

      <EditSidebar />
      <IntentTableToolbar />
    </>
  );
};

export default IntentTable;
