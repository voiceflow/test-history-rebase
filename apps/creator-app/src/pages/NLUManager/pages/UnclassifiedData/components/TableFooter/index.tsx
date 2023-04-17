import React from 'react';

import { TableOrderDropdown } from './components';
import * as S from './styles';

const TableFooter: React.FC = () => (
  <S.FooterContainer>
    <TableOrderDropdown />
  </S.FooterContainer>
);

export default TableFooter;
