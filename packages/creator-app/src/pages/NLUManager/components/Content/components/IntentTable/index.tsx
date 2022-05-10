import React from 'react';

import { InteractionModelTabType } from '@/constants';
import { useOrderedIntents } from '@/pages/Canvas/components/NLUQuickView/hooks';
import IntentItem from '@/pages/NLUManager/components/Content/components/IntentTable/IntentItem';
import { FullTable } from '@/pages/NLUManager/components/Content/components/Table/FullTable';
import { useTableOrderBy } from '@/pages/NLUManager/components/Content/hooks';

import { IntentTableColumns, TableMeta, TableSorters } from '../../constants';

const IntentTable: React.FC = () => {
  const { sortedIntents } = useOrderedIntents();
  const { columns } = TableMeta[InteractionModelTabType.INTENTS];

  const sorters = TableSorters[InteractionModelTabType.INTENTS];

  const { orderedItems, setOrderType, orderType, descending } = useTableOrderBy({
    items: sortedIntents,
    sorters,
    startingSorter: IntentTableColumns.name,
  });

  return (
    <FullTable
      ItemComponent={IntentItem}
      orderedItems={orderedItems}
      sorters={sorters}
      columns={columns}
      setOrderType={setOrderType}
      orderType={orderType}
      orderDirection={descending}
    />
  );
};

export default IntentTable;
