import React from 'react';

import * as S from './styles';

interface MenuItemProps {
  label: React.ReactNode;
}

export const MenuItem: React.FC<MenuItemProps> = ({ label }): React.ReactElement => {
  return (
    <S.Container>
      <S.Label fullWidth>{label}</S.Label>
    </S.Container>
  );
};
