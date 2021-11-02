import { Constants } from '@voiceflow/general-types';
import { Icon } from '@voiceflow/ui';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import { Node, NodeData } from '@/models';

export interface ConnectedStepProps<T = {}> {
  node: Node;
  data: NodeData<T>;
  platform: Constants.PlatformType;
  withPorts: boolean;
}

export interface ItemProps {
  icon?: Icon | null;
  label?: React.ReactNode | null;
  portID?: string | null;
  onClick?: React.ReactEventHandler;
  iconColor?: string;
  portColor?: string;
  attachment?: boolean;
  linkedLabel?: React.ReactNode | null;
  placeholder?: string;
  labelVariant?: StepLabelVariant;
  withNewLines?: boolean;
  multilineLabel?: boolean;
  labelLineClamp?: number;
  onAttachmentClick?: React.MouseEventHandler<HTMLButtonElement>;
}
