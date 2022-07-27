import { Table } from '@voiceflow/ui';
import React from 'react';

import { OrderedVariable } from '@/hooks';
import EmptyView from '@/pages/Canvas/components/NLUQuickView/components/EmptyView';
import { useNLUManager } from '@/pages/NLUManager/context';

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

  return (
    <Table.Configurable
      empty={<EmptyView pageType={nluManager.activeTab} onCreate={() => nluManager.createAndGoToItem(nluManager.search)} />}
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
