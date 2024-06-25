import { clsx } from '@voiceflow/style';
import React from 'react';

import { v3GlobalOverrides } from './V3StyleContainer.css';
import type { IV3StyleContainer } from './V3StyleContainer.interface';

export const V3StyleContainer: React.FC<IV3StyleContainer> = ({ children, className, ...props }) => (
  <div className={clsx(className, v3GlobalOverrides)} {...props}>
    {children}
  </div>
);
