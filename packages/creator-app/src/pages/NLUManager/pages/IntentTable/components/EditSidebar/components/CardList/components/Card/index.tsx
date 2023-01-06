import { SvgIcon } from '@voiceflow/ui';
import React from 'react';

import * as S from './styles';

interface CardProps {
  color: string;
  title: React.ReactNode;
  onClose: () => void;
}

const Card: React.OldFC<CardProps> = ({ color, title, onClose, children }) => (
  <S.Container>
    <S.TitleContainer color={color}>
      {title}
      <SvgIcon icon="close" size={14} onClick={onClose} color="white" clickable />
    </S.TitleContainer>

    <S.BodyContainer>{children}</S.BodyContainer>
  </S.Container>
);

export default Card;
