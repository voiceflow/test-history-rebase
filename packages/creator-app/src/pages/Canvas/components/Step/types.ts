import { Constants } from '@voiceflow/general-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Icon } from '@voiceflow/ui';
import React from 'react';

import { BlockVariant, StepLabelVariant } from '@/constants/canvas';
import type { Engine } from '@/pages/Canvas/engine';

export interface ConnectedStepProps<T = {}, O extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord> {
  node: Realtime.Node<O>;
  data: Realtime.NodeData<T>;
  engine: Engine;
  platform: Constants.PlatformType;
  variant: BlockVariant;
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
  wordBreak?: boolean;
  attachment?: React.ReactNode;
  linkedLabel?: React.ReactNode | null;
  placeholder?: string;
  labelVariant?: StepLabelVariant;
  withNewLines?: boolean;
  attachmentRef?: React.Ref<HTMLButtonElement>;
  multilineLabel?: boolean;
  labelLineClamp?: number;
  variant?: BlockVariant;
}
