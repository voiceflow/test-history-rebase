import React from 'react';
import { matchPath, useLocation } from 'react-router-dom';

import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks/realtime';

import Item, { ItemProps } from './Item';

interface NavItemProps extends Omit<ItemProps, 'onClick' | 'isActive'> {
  to: string;
  exact?: boolean;
  isActive?: (options: { pathname: string; exact?: boolean; matchPath: typeof matchPath }) => boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, exact, isActive: isActiveProp, ...itemProps }) => {
  const location = useLocation();
  const isActive = isActiveProp
    ? isActiveProp({ exact, matchPath, pathname: location.pathname })
    : !!matchPath(location.pathname, { path: to, exact });

  const goTo = useDispatch(Router.goTo);

  return <Item onClick={() => goTo(to)} isActive={isActive} {...itemProps} />;
};

export default NavItem;
