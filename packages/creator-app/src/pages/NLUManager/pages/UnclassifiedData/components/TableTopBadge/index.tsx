import { SvgIcon, Text } from '@voiceflow/ui';
import React from 'react';

import { useNLUManager } from '@/pages/NLUManager/context';

import * as S from './styles';

const TableTopBadge: React.FC = () => {
  const { isScrolling, scrollToTop } = useNLUManager();

  if (!isScrolling) return null;

  return (
    <S.BadgeContainer onClick={scrollToTop}>
      <SvgIcon icon="arrowDown" size={14} rotation={180} color="#F2F7F7" />
      <Text fontSize={13} color="#F2F7F7">
        Top
      </Text>
    </S.BadgeContainer>
  );
};

export default TableTopBadge;
