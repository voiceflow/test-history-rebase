import { SvgIconTypes } from '@ui/components/SvgIcon';
import React from 'react';

import { Size } from './icon-button.enum';

export interface Props extends Omit<React.ComponentProps<'button'>, 'ref'> {
  icon?: SvgIconTypes.Icon;
  size?: Size;
  active?: boolean;
  iconProps?: Omit<SvgIconTypes.Props, 'icon'>;
  hoverBackground?: boolean;
  activeBackground?: boolean;
}
