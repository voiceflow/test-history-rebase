import { Icon, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { BlockVariant } from '@/constants/canvas';
import { getIconColor } from '@/styles/theme/block';

import IconContainer from './StepIconContainer';

export interface StepIconProps {
  icon?: Icon | null;
  iconColor?: string;
  variant?: BlockVariant;
}

const StepIcon: React.FC<StepIconProps> = ({ variant, icon, iconColor }) => (
  <IconContainer color={variant ? getIconColor(variant) : iconColor}>{icon && <SvgIcon icon={icon} size={18} />}</IconContainer>
);

export default StepIcon;
