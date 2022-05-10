import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BaseSystemMessageProps } from '@/pages/Canvas/managers/components/SystemMessage/types';

export interface VoicePromptProps extends BaseSystemMessageProps {
  message: Realtime.NodeData.VoicePrompt;
  onChange: (message: Partial<Realtime.NodeData.VoicePrompt>) => void;
}

export interface PromptProps extends BaseSystemMessageProps {
  message: BaseNode.Text.TextData | Realtime.NodeData.VoicePrompt;
  onChange: (message: Partial<BaseNode.Text.TextData | Realtime.NodeData.VoicePrompt>) => void;
}
