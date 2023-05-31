import React from 'react';
import { matchPath, useLocation } from 'react-router-dom';

import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks/realtime';

import Item, { ItemProps } from './Item';

interface NavItemProps extends Omit<ItemProps, 'onClick' | 'isActive'> {
  to: string;
  exact?: boolean;
  isActive?: (options: { pathname: string; exact?: boolean; matchPath: typeof matchPath }) => boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, exact, isActive: isActiveProp, onClick, ...itemProps }) => {
  const location = useLocation();
  const isActive = isActiveProp
    ? isActiveProp({ exact, matchPath, pathname: location.pathname })
    : !!matchPath(location.pathname, { path: to, exact });

  const goTo = useDispatch(Router.goTo);

  const handleClick = () => goTo(to);

  return <Item onClick={onClick || handleClick} isActive={isActive} {...itemProps} />;
};

export default NavItem;
