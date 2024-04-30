import cn from 'classnames';
import React from 'react';
import type { NavLinkProps } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

import { ClassName } from '@/styles/constants';

import NavItemContainer from './NavItemContainer';

const NavItem: React.FC<NavLinkProps> = ({ children, replace = true, className, ...props }) => (
  <NavLink
    replace={replace}
    className={
      typeof className === 'function'
        ? (isActive) => cn(ClassName.POPPER_NAV_ITEM, className(isActive))
        : cn(ClassName.POPPER_NAV_ITEM, className)
    }
    {...props}
  >
    <NavItemContainer>{children}</NavItemContainer>
  </NavLink>
);

export default NavItem;
