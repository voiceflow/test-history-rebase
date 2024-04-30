import React from 'react';

import { FadeDown } from '@/styles/animations';

import * as S from './styles';

interface BubbleProps {
  onClick: () => void;
  direction: 'up' | 'down';
  children?: React.ReactNode;
}

const Bubble: React.FC<BubbleProps> = ({ onClick, direction, children }) => {
  return (
    <FadeDown>
      <S.BubbleButton onClick={onClick}>
        <S.BubbleIcon icon="arrowDown" color="white" rotation={direction === 'up' ? 180 : 0} />
        {children}
      </S.BubbleButton>
    </FadeDown>
  );
};

export default Bubble;
