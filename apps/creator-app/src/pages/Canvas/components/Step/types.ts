import type { SvgIconTypes } from '@voiceflow/ui';
import type React from 'react';

import type { HSLShades } from '@/constants';
import type { StepLabelVariant } from '@/constants/canvas';

export interface ItemProps extends React.PropsWithChildren {
  icon?: SvgIconTypes.Icon | null;
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
  newLineAttachment?: React.ReactNode;
  parentActionsPath?: string;
  parentActionsParams?: Record<string, string>;
}
