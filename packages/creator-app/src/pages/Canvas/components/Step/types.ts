import * as Realtime from '@voiceflow/realtime-sdk';
import { Icon } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';
import { StyledProps } from 'styled-components';

import { HSLShades } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import type Engine from '@/pages/Canvas/engine';

export interface ConnectedStepProps<T = {}, O extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord> {
  ports: Realtime.NodePorts<O>;
  data: Realtime.NodeData<T>;
  engine: Engine;
  platform: VoiceflowConstants.PlatformType;
  projectType: VoiceflowConstants.ProjectType;
  palette: HSLShades;
  withPorts: boolean;
}

export type ConnectedStep<T = {}, O extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord> = React.FC<ConnectedStepProps<T, O>>;

export interface ItemProps extends StyledProps<any> {
  icon?: Icon | null;
  label?: React.ReactNode | null;
  title?: React.ReactNode | null;
  portID?: string | null;
  onClick?: React.ReactEventHandler;
  iconColor?: string;
  portColor?: string;
  wordBreak?: boolean;
  attachment?: React.ReactNode;
  prefix?: React.ReactNode;
  linkedLabel?: React.ReactNode | null;
  placeholder?: string;
  labelVariant?: StepLabelVariant;
  withNewLines?: boolean;
  attachmentRef?: React.Ref<HTMLButtonElement>;
  multilineLabel?: boolean;
  labelLineClamp?: number;
  palette?: HSLShades;
  nested?: boolean;
  nestedWithIcon?: boolean;
  textColor?: string;
  iconSize?: number;
  iconStyle?: React.CSSProperties;
  image?: string | null;
  v2?: boolean;
}
