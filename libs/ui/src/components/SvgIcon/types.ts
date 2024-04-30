import type React from 'react';

import type * as ICONS from '@/svgs';

import type { Variant as VariantType } from './constants';
import type { ContainerProps } from './styles';

export type Icon = keyof typeof ICONS;

export type Variant = VariantType;

export interface Props extends Partial<ContainerProps> {
  id?: string;
  icon: Icon | React.ComponentType;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
  className?: string;
  onMouseDown?: React.MouseEventHandler<HTMLSpanElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLSpanElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLSpanElement>;
}
