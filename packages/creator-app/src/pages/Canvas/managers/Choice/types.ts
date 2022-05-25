import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockVariant } from '@/constants';

export interface ChoiceItem {
  key: string;
  label: Nullable<string>;
  portID: Nullable<string>;
  attachment?: boolean;
  linkedLabel?: Nullable<string>;
  onAttachmentClick?: VoidFunction;
}

export interface ChoiceStepProps {
  nodeID: string;
  choices: ChoiceItem[];
  noMatch: Nullable<Realtime.NodeData.NoMatch>;
  noReply?: Nullable<Realtime.NodeData.NoReply>;
  variant: BlockVariant;
  noMatchPortID?: Nullable<string>;
  noReplyPortID?: Nullable<string>;
}
