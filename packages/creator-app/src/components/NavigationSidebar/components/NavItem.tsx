import React from 'react';
import { matchPath, useLocation } from 'react-router-dom';

import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';

import Item, { ItemProps } from './Item';

interface NavItemProps extends Omit<ItemProps, 'onClick' | 'isActive'> {
  to: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, ...itemProps }) => {
  const location = useLocation();
  const isActive = !!matchPath(location.pathname, to);
  const goTo = useDispatch(Router.goTo);

  return <Item onClick={() => goTo(to)} isActive={isActive} {...itemProps} />;
};

export default NavItem;
