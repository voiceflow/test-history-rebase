import { CustomScrollbarsTypes } from '@voiceflow/ui';
import React from 'react';

import { useScrollContext, useScrollStickySides } from '@/hooks';

import * as S from './styles';

interface HeaderProps extends S.ContainerProps, React.PropsWithChildren {
  label: string;
  onClick?: VoidFunction;
  collapsed?: boolean;
  forceSticky?: boolean;
  rightAction?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ label, children, collapsed, forceSticky, rightAction, onClick, ...containerProps }) => {
  const { scrollRef } = useScrollContext<CustomScrollbarsTypes.Scrollbars>();
  const [isHeaderSticky] = useScrollStickySides(scrollRef);

  return (
    <S.Container {...containerProps} onClick={onClick} collapsed={collapsed} isSticky={forceSticky || isHeaderSticky}>
      <S.LabelContainer>
        {label}

        {rightAction}
      </S.LabelContainer>

      {children}
    </S.Container>
  );
};

export default Header;
