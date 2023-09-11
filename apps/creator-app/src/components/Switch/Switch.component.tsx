import React from 'react';

import type { ISwitch } from './Switch.interface';

export const Switch: React.FC<ISwitch> = ({ value, children }) => (
  <>{React.Children.map(children, (child) => (child.props.value !== value ? null : child))}</>
);
