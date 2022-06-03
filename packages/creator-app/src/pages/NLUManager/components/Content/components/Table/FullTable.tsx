import * as Realtime from '@voiceflow/realtime-sdk';
import { useOnScreen } from '@voiceflow/ui';
import * as React from 'react';

import { Variable } from '@/pages/Canvas/components/InteractionModelModal/components/VariablesManager/types';
import { TableContainer } from '@/pages/NLUManager/components/Content/components';
import TableHeader from '@/pages/NLUManager/components/Content/components/Table/components/TableHeader';
import Table from '@/pages/NLUManager/components/Content/components/Table/index';

interface FullTableProps {
  orderedItems: Realtime.Intent[] | Realtime.Slot[] | Variable[];
  sorters: Record<string, (a: any, b: any) => number>;
  columns: { name: string; flexWidth: number }[];
  setOrderType: (orderType: string) => void;
  orderType: string;
  orderDirection: boolean;
  ItemComponent: React.FC<any>;
}

export const FullTable: React.FC<FullTableProps> = ({ ItemComponent, orderedItems, orderDirection, sorters, columns, setOrderType, orderType }) => {
  const topOfTableRef = React.useRef<HTMLDivElement>(null);
  const hasScrolled = !useOnScreen(topOfTableRef, { initialState: true });
  return (
    <TableContainer>
      <div ref={topOfTableRef} />
      {!!orderedItems.length && (
        <TableHeader
          hasScrolled={hasScrolled}
          sorters={sorters}
          columns={columns}
          setOrderType={setOrderType}
          orderType={orderType}
          orderDirection={orderDirection}
        />
      )}
      <Table ItemComponent={ItemComponent} items={orderedItems} />
    </TableContainer>
  );
};
