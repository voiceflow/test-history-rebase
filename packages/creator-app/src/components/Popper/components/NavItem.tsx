import React from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';

import NavItemContainer from './NavItemContainer';

const NavItem: React.FC<NavLinkProps> = ({ children, replace = true, ...props }) => (
  <NavLink replace={replace} {...props}>
    <NavItemContainer>{children}</NavItemContainer>
  </NavLink>
);

export default NavItem;
