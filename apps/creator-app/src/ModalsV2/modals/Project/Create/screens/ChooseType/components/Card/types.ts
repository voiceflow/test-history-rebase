import { SvgIconTypes } from '@voiceflow/ui';
import React from 'react';

export interface Bubble {
  name: string;
  icon: SvgIconTypes.Icon;
  color?: string;
}

export interface Props {
  title: React.ReactNode;
  badge?: React.ReactNode;
  bubbles: Bubble[];
  onClick?: VoidFunction;
  onDoubleClick?: VoidFunction;
  isActive?: boolean;
  description: React.ReactNode;
}
