import { Box } from '@voiceflow/ui';
import React from 'react';

import Checkbox, { CheckboxType } from '@/components/Checkbox';
import { NLUManagerContext } from '@/pages/NLUManager/context';

import { Header } from '..';
import HeaderItem from './components/HeaderItem';

interface TableHeaderProps {
  columns: any[];
  setOrderType: (type: string) => void;
  orderType: string;
  orderDirection: boolean;
  sorters: Record<string, (a: any, b: any) => number>;
  hasScrolled: boolean;
}

const TableHeader: React.FC<TableHeaderProps> = ({ hasScrolled, sorters, orderDirection, columns, setOrderType, orderType }) => {
  const { toggleAllCheckedItems, checkedItems } = React.useContext(NLUManagerContext);

  return (
    <Header hasScrolled={hasScrolled}>
      <Box display="inline-block">
        <Checkbox type={CheckboxType.DASH} checked={!!checkedItems.length} onClick={toggleAllCheckedItems} />
      </Box>
      {columns.map((column) => (
        <HeaderItem
          key={column.name}
          column={column}
          sorters={sorters}
          orderDirection={orderDirection}
          orderType={orderType}
          setOrderType={setOrderType}
        />
      ))}
    </Header>
  );
};

export default TableHeader;
