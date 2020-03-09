import React from 'react';

import { Icon } from '@/components/SvgIcon';
import { StepLabelVariant } from '@/constants/canvas';

export type ItemProps = {
  portID?: string | null;
  icon?: Icon | null;
  label?: React.ReactNode | null;
  onClick?: React.ReactEventHandler;
  iconColor?: string;
  portColor?: string;
  placeholder?: string;
  labelVariant?: StepLabelVariant;
  multilineLabel?: boolean;
  labelLineClamp?: number;
  portComponent?: React.FC<{ portID: string }>;
};
