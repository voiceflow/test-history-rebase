import React from 'react';

import {
  BackButton,
  Divider,
  HotkeyToAction,
  IconButton,
  InlineBackButton,
  LeftSection,
  LogoButton,
  NavLinkSidebarTitle,
  RightSection,
  Tab,
  Title,
} from './components';
import * as S from './styles';
import type * as T from './types';

export * as HeaderTypes from './types';

const Header: React.FC<T.Props> = ({ children, renderLogoButton, containerStyles = {} }) => (
  <S.Container style={containerStyles}>
    {renderLogoButton?.()}

    <S.Content>{children}</S.Content>
  </S.Container>
);

export default Object.assign(Header, {
  Tab,
  Title,
  Divider,
  BackButton,
  IconButton,
  LogoButton,
  LeftSection,
  RightSection,
  HotkeyToAction,
  InlineBackButton,
  NavLinkSidebarTitle,
});
