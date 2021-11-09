import { Constants } from '@voiceflow/general-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Icon } from '@voiceflow/ui';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';

export interface ConnectedStepProps<T = {}> {
  node: Realtime.Node;
  data: Realtime.NodeData<T>;
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
