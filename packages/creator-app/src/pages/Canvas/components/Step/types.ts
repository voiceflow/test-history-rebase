import { PlatformType } from '@voiceflow/internal';
import { Icon } from '@voiceflow/ui';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import { Node, NodeData } from '@/models';

export interface ConnectedStepProps<T = {}> {
  node: Node;
  data: NodeData<T>;
  platform: PlatformType;
  withPorts: boolean;
}

export interface ItemProps {
  portID?: string | null;
  icon?: Icon | null;
  label?: React.ReactNode | null;
  onClick?: React.ReactEventHandler;
  iconColor?: string;
  portColor?: string;
  placeholder?: string;
  labelVariant?: StepLabelVariant;
  withNewLines?: boolean;
  multilineLabel?: boolean;
  labelLineClamp?: number;
}
