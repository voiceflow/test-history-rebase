import { Bubble } from '@voiceflow/ui';
import React from 'react';

import * as S from '../styles';

interface Props {
  onScrollToEnd: (options?: ScrollIntoViewOptions | undefined) => void;
  endNodeRef: React.Ref<HTMLDivElement>;
  isScrolledToEnd?: boolean;
  body: React.ReactNode;
}

const Disclaimer: React.FC<Props> = ({ onScrollToEnd, endNodeRef, isScrolledToEnd, body }) => (
  <S.OuterContainer>
    <S.Container>
      {body}
      <div ref={endNodeRef}></div>
    </S.Container>
    {!isScrolledToEnd && (
      <S.ButtonContainer>
        <Bubble onClick={onScrollToEnd} direction="down">
          Scroll to bottom
        </Bubble>
      </S.ButtonContainer>
    )}
  </S.OuterContainer>
);

export default Disclaimer;
