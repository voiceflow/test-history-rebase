import { Slot } from '@voiceflow/realtime-sdk';
import { Table } from '@voiceflow/ui';
import React from 'react';

import { useHotkey } from '@/hooks';
import { Hotkey } from '@/keymap';
import { useTableHotkeys } from '@/pages/NLUManager/hooks';

import { useNLUManager } from '../../context';
import NluHeader from '../components/NluHeader';
import { EditSidebar, EmptyScreen, EntityTableToolbar, Row } from './components';
import { COLUMNS, TableColumn } from './constants';

const EntityTable: React.FC = () => {
  const nluManager = useNLUManager();
  const search = React.useMemo(() => [nluManager.search], [nluManager.search]);

  const { items, orderBy, descending, onChangeOrderBy } = Table.useFilterOrderItems({
    items: nluManager.entities as Slot[],
    columns: COLUMNS,
    filterBy: search,
    initialOrderBy: TableColumn.NAME,
    getItemFilterBy: (item) => [item.name],
    isDescending: false,
  });

  const selectAllItems = () => {
    nluManager.setSelectedEntityIDs(nluManager.entities.map((e) => e.id));
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
        renderRow={(props) => <Row {...props} />}
        scrolled={nluManager.isScrolling}
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
      <EntityTableToolbar />
    </>
  );
};

export default EntityTable;
