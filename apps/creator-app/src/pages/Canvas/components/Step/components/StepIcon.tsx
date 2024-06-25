import type { SvgIconTypes } from '@voiceflow/ui';
import { SvgIcon } from '@voiceflow/ui';
import React from 'react';

import type { HSLShades } from '@/constants';

import IconContainer from './StepIconContainer';

export interface StepIconProps extends Omit<SvgIconTypes.Props, 'icon'> {
  icon?: SvgIconTypes.Icon | null;
  iconColor?: string;
  iconSize?: number;
  palette?: HSLShades;
}

const StepIcon: React.FC<StepIconProps> = ({ palette, icon, iconColor, iconSize = 18, style, ...props }) => (
  <IconContainer color={palette ? palette?.[600] : iconColor} style={style}>
    {icon && <SvgIcon icon={icon} size={iconSize} color={iconColor} {...props} />}
  </IconContainer>
);

export default StepIcon;
