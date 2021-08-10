import { Icon } from '@voiceflow/ui';
import React from 'react';

import IconButton from './IconButton';

interface ButtonProps {
  icon: Icon;
  active: boolean;
  onMouseDown: React.MouseEventHandler<HTMLButtonElement>;
}

const Button: React.FC<ButtonProps> = (props) => <IconButton {...props} />;

export default Button;
