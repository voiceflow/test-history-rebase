import React from 'react';

import * as S from './styles';

interface GroupHeaderProps {
  isSmall?: boolean;
}

const GroupHeader: React.FC<GroupHeaderProps> = ({ isSmall, children }) => (
  <S.Container isSmall={isSmall}>
    <S.Title>{children}</S.Title>
    <S.Line />
  </S.Container>
);

export default GroupHeader;
