import React from 'react';

import { Container, Content } from './components';

export type { IconButtonProps as HeaderIconButtonProps } from './components';
export {
  BackButton as HeaderBackButton,
  Divider as HeaderDivider,
  HotkeyToAction as HeaderHotkeyToAction,
  IconButton as HeaderIconButton,
  LogoButton as HeaderLogoButton,
  NavLinkSidebarTitle as HeaderNavLinkSidebarTitle,
  Title as HeaderTitle,
} from './components';

interface HeaderProps {
  renderLogoButton?: () => React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children, renderLogoButton }) => (
  <Container>
    {renderLogoButton?.()}

    <Content>{children}</Content>
  </Container>
);

export default Header;
