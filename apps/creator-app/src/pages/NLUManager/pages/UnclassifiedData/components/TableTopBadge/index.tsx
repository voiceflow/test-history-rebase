import { Bubble } from '@voiceflow/ui';
import React from 'react';

import { useNLUManager } from '@/pages/NLUManager/context';

import * as S from './styles';

const TableTopBadge: React.FC = () => {
  const { isScrolling, scrollToTop } = useNLUManager();

  if (!isScrolling) return null;

  return (
    <S.BadgeContainer>
      <Bubble onClick={scrollToTop} direction="up">
        Top
      </Bubble>
    </S.BadgeContainer>
  );
};

export default TableTopBadge;
