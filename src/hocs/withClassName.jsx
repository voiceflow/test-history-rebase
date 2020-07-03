import cn from 'classnames';
import React from 'react';

import { IS_PRODUCTION } from '@/config';

// eslint-disable-next-line import/prefer-default-export
export const withClassName = (className) => (StyledComponent) =>
  IS_PRODUCTION ? StyledComponent : (props) => <StyledComponent {...props} className={cn(props.className, className)} />;
