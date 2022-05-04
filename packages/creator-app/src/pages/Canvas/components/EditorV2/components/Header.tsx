import { Flex } from '@voiceflow/ui';
import React from 'react';

import HeaderContainer from './HeaderContainer';
import HeaderTitle from './HeaderTitle';

export interface HeaderProps {
  title: string;
  prefix?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, prefix, children }) => (
  <HeaderContainer>
    <Flex>
      {prefix}

      <HeaderTitle>{title}</HeaderTitle>
    </Flex>

    {children}
  </HeaderContainer>
);

export default Header;
