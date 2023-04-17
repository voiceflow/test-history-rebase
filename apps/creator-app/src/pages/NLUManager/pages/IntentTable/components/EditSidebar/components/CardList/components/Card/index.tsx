import { Collapse, ProgressBar } from '@voiceflow/ui';
import React from 'react';

import { useEnableDisable } from '@/hooks';

import * as S from './styles';

interface CardProps extends React.PropsWithChildren {
  color: string;
  title: React.ReactNode;
  level?: number;
  expandedProp?: boolean;
}

const Card: React.FC<CardProps> = ({ color, title, level = 0, expandedProp = false, children }) => {
  const [expanded, onExpand, onCollapse] = useEnableDisable(false);

  return (
    <S.Container onMouseEnter={onExpand} onMouseLeave={onCollapse}>
      <S.TitleContainer color={color}>
        {title}
        <ProgressBar width={40} background="rgba(255, 255, 255, 0.3)" color="rgba(255, 255, 255, 0.5)" height={2} progress={level} />
      </S.TitleContainer>
      <Collapse isOpen={expanded || expandedProp}>
        <S.BodyContainer>{children}</S.BodyContainer>
      </Collapse>
    </S.Container>
  );
};

export default Card;
