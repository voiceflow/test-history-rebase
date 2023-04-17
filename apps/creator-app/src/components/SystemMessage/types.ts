import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

export interface BaseSystemMessageProps {
  onEmpty?: (isEmpty: boolean) => void;
  isActive?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
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

export interface ChatMessageRef {
  getCurrentValue: () => BaseNode.Text.TextData;
}

export interface VoiceMessageRef {
  getCurrentValue: () => Realtime.SpeakData;
}

export interface SystemMessageRef {
  getCurrentValue: () => BaseNode.Text.TextData | Realtime.SpeakData;
}
