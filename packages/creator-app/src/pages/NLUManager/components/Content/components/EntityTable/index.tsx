import React from 'react';

import { InteractionModelTabType } from '@/constants';
import { useOrderedEntities } from '@/pages/Canvas/components/NLUQuickView/hooks';
import { FullTable } from '@/pages/NLUManager/components/Content/components/Table/FullTable';
import { useTableOrderBy } from '@/pages/NLUManager/components/Content/hooks';

import { EntityTableColumns, TableMeta, TableSorters } from '../../constants';
import EntityItem from './EntityItem';

const EntityTable: React.FC = () => {
  const { sortedSlots } = useOrderedEntities();
  const { columns } = TableMeta[InteractionModelTabType.SLOTS];

  const sorters = TableSorters[InteractionModelTabType.SLOTS];

  const { orderedItems, setOrderType, orderType, descending } = useTableOrderBy({
    items: sortedSlots,
    sorters,
    startingSorter: EntityTableColumns.name,
  });

  return (
    <FullTable
      orderedItems={orderedItems}
      sorters={sorters}
      columns={columns}
      setOrderType={setOrderType}
      orderType={orderType}
      orderDirection={descending}
      ItemComponent={EntityItem}
    />
  );
};

export default EntityTable;
