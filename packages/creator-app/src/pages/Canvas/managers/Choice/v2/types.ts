import { Nullable } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockVariant } from '@/constants';
import { EntityPrompt } from '@/pages/Canvas/types';

export interface ChoiceItem {
  key: string;
  label: Nullable<string>;
  portID: Nullable<string>;
  withAttachment?: boolean;
  withPreview?: boolean;
  linkedLabel?: Nullable<string>;
  prompts: EntityPrompt[];
  onGoToLinkedIntent?: () => void;
}

export interface ChoiceStepProps {
  nodeID: string;
  choices: ChoiceItem[];
  noMatch: Nullable<Realtime.NodeData.NoMatch>;
  noReply?: Nullable<Realtime.NodeData.NoReply>;
  variant: BlockVariant;
  noMatchPortID?: Nullable<string>;
  noReplyPortID?: Nullable<string>;
  onOpenEditor: () => void;
}
