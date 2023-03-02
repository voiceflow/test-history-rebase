import { SvgIconTypes } from '@ui/components/SvgIcon';
import React from 'react';

import { Size } from './icon-button.enum';

export interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: SvgIconTypes.Icon;
  size?: Size;
  active?: boolean;
  iconProps?: Omit<SvgIconTypes.Props, 'icon'>;
  hoverBackground?: boolean;
  activeBackground?: boolean;
}
