import cn from 'classnames';
import React from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';

import { ClassName } from '@/styles/constants';

import NavItemContainer from './NavItemContainer';

const NavItem: React.FC<NavLinkProps> = ({ children, replace = true, className, ...props }) => (
  <NavLink className={cn(ClassName.POPPER_NAV_ITEM, className)} replace={replace} {...props}>
    <NavItemContainer>{children}</NavItemContainer>
  </NavLink>
);

export default NavItem;
