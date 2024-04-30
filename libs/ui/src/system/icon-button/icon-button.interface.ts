import type React from 'react';

import type { SvgIconTypes } from '@/components/SvgIcon';

import type { Size } from './icon-button.enum';

export interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: SvgIconTypes.Icon;
  size?: Size;
  active?: boolean;
  iconProps?: Omit<SvgIconTypes.Props, 'icon'>;
  hoverBackground?: boolean;
  activeBackground?: boolean;
}
