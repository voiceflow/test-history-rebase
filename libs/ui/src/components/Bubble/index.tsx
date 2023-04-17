import { FadeDownContainer } from '@ui/styles/animations';
import React from 'react';

import * as S from './styles';

interface BubbleProps {
  onClick: () => void;
  direction: 'up' | 'down';
  children?: React.ReactNode;
}

const Bubble: React.FC<BubbleProps> = ({ onClick, direction, children }) => {
  return (
    <FadeDownContainer>
      <S.BubbleButton onClick={onClick}>
        <S.BubbleIcon icon="arrowDown" color="white" rotation={direction === 'up' ? 180 : 0} />
        {children}
      </S.BubbleButton>
    </FadeDownContainer>
  );
};

export default Bubble;
