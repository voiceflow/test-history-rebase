import React from 'react';
import { matchPath, useLocation } from 'react-router-dom';

import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';

interface NavLinkProps extends React.PropsWithChildren {
  to: string;
  as?: string | React.ComponentType<any>;
  exact?: boolean;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ as: Item = 'button', to, exact, ...itemProps }) => {
  const location = useLocation();
  const isActive = !!matchPath(location.pathname, { path: to, exact });
  const goTo = useDispatch(Router.goTo);

  return (
    <Item
      {...(Item === 'button' ? { type: 'button' } : {})}
      onClick={() => goTo(to)}
      isActive={isActive}
      {...itemProps}
    />
  );
};

export default NavLink;
