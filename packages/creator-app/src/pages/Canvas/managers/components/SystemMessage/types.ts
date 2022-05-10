import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

export interface BaseSystemMessageProps {
  autoFocus?: boolean;
}

export interface ChatMessageProps extends BaseSystemMessageProps {
  message: BaseNode.Text.TextData;
  onChange: (message: Partial<BaseNode.Text.TextData>) => void;
}

export interface VoiceMessageProps extends BaseSystemMessageProps {
  message: Realtime.SpeakData;
  onChange: (message: Partial<Realtime.SpeakData>) => void;
}

export interface SystemMessageProps extends BaseSystemMessageProps {
  message: BaseNode.Text.TextData | Realtime.SpeakData;
  onChange: (message: Partial<BaseNode.Text.TextData | Realtime.SpeakData>) => void;
}
