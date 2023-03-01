import { Table } from '@voiceflow/ui';
import React from 'react';

import { useHotkey } from '@/hooks';
import { Hotkey } from '@/keymap';
import { useNLUManager } from '@/pages/NLUManager/context';
import { useTableHotkeys } from '@/pages/NLUManager/hooks';

import NluHeader from '../components/NluHeader';
import { EditSidebar, EmptyScreen, IntentTableToolbar, Row } from './components';
import { COLUMNS, TableColumn } from './constants';

const IntentTable: React.FC = () => {
  const nluManager = useNLUManager();
  const search = React.useMemo(() => [nluManager.search], [nluManager.search]);

  const { items, orderBy, descending, onChangeOrderBy } = Table.useFilterOrderItems({
    items: nluManager.intents,
    columns: COLUMNS,
    filterBy: search,
    initialOrderBy: TableColumn.NAME,
    isDescending: false,
    getItemFilterBy: (item) => [item.name],
  });

  const selectAllItems = () => {
    nluManager.setSelectedIntentIDs(nluManager.intents.map((i) => i.id));
  };

  useTableHotkeys(items);
  useHotkey(Hotkey.SELECT_ALL, selectAllItems, { action: 'keyup' });

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
        header={
          <NluHeader scrolled={nluManager.isScrolling}>
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
          </NluHeader>
        }
      />

      <EditSidebar />
      <IntentTableToolbar />
    </>
  );
};

export default IntentTable;
