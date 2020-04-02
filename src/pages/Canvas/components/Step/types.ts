import React from 'react';

import { Icon } from '@/components/SvgIcon';
import { PlatformType } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import { Node, NodeData } from '@/models';

export type ConnectedStepProps<T = {}> = {
  node: Node;
  data: NodeData<T>;
  platform: PlatformType;
  withPorts: boolean;
};

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
};
