import { CustomScrollbarsTypes } from '@voiceflow/ui';
import React from 'react';

import { useScrollContext, useScrollStickySides } from '@/hooks';

import * as S from './styles';

interface HeaderProps {
  label: string;
  collapsed?: boolean;
  forceSticky?: boolean;
  rightAction?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ label, children, collapsed, forceSticky, rightAction }) => {
  const { scrollRef } = useScrollContext<CustomScrollbarsTypes.Scrollbars>();
  const [isHeaderSticky] = useScrollStickySides(scrollRef);

  return (
    <S.Container collapsed={collapsed} isSticky={forceSticky || isHeaderSticky}>
      <S.Content>
        <S.LabelContainer>
          {label}

          {rightAction}
        </S.LabelContainer>

        {children}
      </S.Content>
    </S.Container>
  );
};

export default Header;
