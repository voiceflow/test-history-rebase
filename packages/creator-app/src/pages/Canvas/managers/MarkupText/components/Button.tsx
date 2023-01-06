import { SvgIconTypes } from '@voiceflow/ui';
import React from 'react';

import IconButton from './IconButton';

interface ButtonProps {
  icon: SvgIconTypes.Icon;
  active: boolean;
  onMouseDown: React.MouseEventHandler<HTMLButtonElement>;
}

const Button: React.OldFC<ButtonProps> = ({ active, ...props }) => <IconButton activeClick={active} {...props} />;

export default Button;
