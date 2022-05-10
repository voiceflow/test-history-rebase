import React from 'react';

import { InteractionModelTabType } from '@/constants';
import { useOrderedVariables } from '@/pages/Canvas/components/NLUQuickView/hooks';
import { FullTable } from '@/pages/NLUManager/components/Content/components/Table/FullTable';
import { TableMeta, TableSorters, VariablesTableColumns } from '@/pages/NLUManager/components/Content/constants';
import { useTableOrderBy } from '@/pages/NLUManager/components/Content/hooks';

import VariableItem from './VariableItem';

const VariableTable: React.FC = () => {
  const { mergedVariables } = useOrderedVariables();
  const { columns } = TableMeta[InteractionModelTabType.VARIABLES];

  const sorters = TableSorters[InteractionModelTabType.VARIABLES];

  const { orderedItems, setOrderType, orderType, descending } = useTableOrderBy({
    items: mergedVariables,
    sorters,
    startingSorter: VariablesTableColumns.name,
  });

  return (
    <FullTable
      orderedItems={orderedItems}
      sorters={sorters}
      columns={columns}
      setOrderType={setOrderType}
      orderType={orderType}
      orderDirection={descending}
      ItemComponent={VariableItem}
    />
  );
};

export default VariableTable;
