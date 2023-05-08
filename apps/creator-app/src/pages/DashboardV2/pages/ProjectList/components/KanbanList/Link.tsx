import React from 'react';

import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';

export interface LinkProps {
  to: string;
  component?: React.FC<{ onClick: VoidFunction }> | string;
  locked?: boolean;
}

const Link: React.FC<LinkProps> = (props) => {
  const goTo = useDispatch(Router.goTo);
  const { to, component: Component = 'div', locked, ...ownProps } = props;

  return <Component onClick={() => !locked && goTo(to)} {...ownProps} />;
};

export default Link;
