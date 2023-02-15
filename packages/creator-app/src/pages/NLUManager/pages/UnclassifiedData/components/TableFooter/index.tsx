import React from 'react';

import { useNLUManager } from '@/pages/NLUManager/context';

import { TableOrderDropdown, TableRangeDropdown } from './components';
import * as S from './styles';

const TableFooter: React.FC = () => {
  const { filteredUtterances } = useNLUManager();

  return (
    <S.FooterContainer position={filteredUtterances.length < 10 ? 'absolute' : 'sticky'}>
      <TableRangeDropdown />
      <TableOrderDropdown />
    </S.FooterContainer>
  );
};

export default TableFooter;
