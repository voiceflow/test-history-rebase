import { Icon, SvgIcon, SvgIconProps } from '@voiceflow/ui';
import React from 'react';

import { BlockVariant } from '@/constants/canvas';
import { getIconColor } from '@/styles/theme/block';

import IconContainer from './StepIconContainer';

export interface StepIconProps extends Omit<SvgIconProps, 'variant' | 'icon'> {
  icon?: Icon | null;
  iconColor?: string;
  iconSize?: number;
  variant?: BlockVariant;
}

const StepIcon: React.FC<StepIconProps> = ({ variant, icon, iconColor, iconSize = 18, style, ...props }) => (
  <IconContainer color={variant ? getIconColor(variant) : iconColor} style={style}>
    {icon && <SvgIcon icon={icon} size={iconSize} {...props} />}
  </IconContainer>
);

export default StepIcon;
