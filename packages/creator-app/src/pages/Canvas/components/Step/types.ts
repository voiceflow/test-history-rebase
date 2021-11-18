import { Constants } from '@voiceflow/general-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Icon } from '@voiceflow/ui';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import type { Engine } from '@/pages/Canvas/engine';

export interface ConnectedStepProps<T = {}, O extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord> {
  node: Realtime.Node<O>;
  data: Realtime.NodeData<T>;
  engine: Engine;
  platform: Constants.PlatformType;
  withPorts: boolean;
}

export type ConnectedStep<T = {}, O extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord> = React.FC<ConnectedStepProps<T, O>>;

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
