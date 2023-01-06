import React from 'react';

import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';

export interface LinkProps {
  to: string;
  component?: React.OldFC<{ onClick: VoidFunction }> | string;
}

const Link: React.OldFC<LinkProps> = (props) => {
  const goTo = useDispatch(Router.goTo);
  const { to, component: Component = 'div', ...ownProps } = props;

  return <Component onClick={() => goTo(to)} {...ownProps} />;
};

export default Link;
