import { BlockText, BoxFlexApart } from '@voiceflow/ui';
import React from 'react';

import { Scrollbars } from '@/components/CustomScrollbars';
import { useScrollContext, useScrollStickySides } from '@/hooks';

import { Container } from './components';

export { CONTAINER_MIN_HEIGHT as HEADER_MIN_HEIGHT } from './components';

interface HeaderProps {
  label: string;
  collapsed?: boolean;
  forceSticky?: boolean;
  rightAction?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ label, children, collapsed, forceSticky, rightAction }) => {
  const { scrollRef } = useScrollContext<Scrollbars>()!;
  const [isHeaderSticky] = useScrollStickySides(scrollRef);

  return (
    <Container collapsed={collapsed} isSticky={forceSticky || isHeaderSticky}>
      <BoxFlexApart width="100%" margin="auto 0">
        <BlockText paddingY="4px" lineHeight="16px" fontSize="13px" fontWeight="600" color="#62778c">
          {label}
        </BlockText>

        {rightAction}
      </BoxFlexApart>

      {children}
    </Container>
  );
};

export default Header;
