import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Entity } from '@voiceflow/sdk-logux-designer';

interface BaseEntityPromptProps {
  slots: Array<Realtime.Slot | Entity>;
  isActive?: boolean;
  autofocus?: boolean;
  placeholder?: string;
}

export interface ChatEntityPromptProps extends BaseEntityPromptProps {
  prompt: Platform.Common.Chat.Models.Prompt.Model;
  onChange: (prompt: Partial<Platform.Common.Chat.Models.Prompt.Model>) => void;
}

export interface VoiceEntityPromptProps extends BaseEntityPromptProps {
  prompt: Platform.Common.Voice.Models.Intent.Prompt;
  onChange: (prompt: Partial<Platform.Common.Voice.Models.Intent.Prompt>) => void;
}

export interface EntityPromptProps extends BaseEntityPromptProps {
  prompt: unknown;
  onChange: (prompt: Partial<unknown>) => void;
}
