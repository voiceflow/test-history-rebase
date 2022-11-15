import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';

interface BasePromptFormProps {
  slots: Realtime.Slot[];
  autofocus?: boolean;
  placeholder: string;
}

export interface ChatPromptFormProps extends BasePromptFormProps {
  prompt: Platform.Common.Chat.Models.Prompt.Model[];
  onChange: (prompt: Platform.Common.Chat.Models.Prompt.Model[]) => void;
}

export interface VoicePromptFormProps extends BasePromptFormProps {
  prompt: Platform.Common.Voice.Models.Intent.Prompt[];
  onChange: (prompt: Platform.Common.Voice.Models.Intent.Prompt[]) => void;
}

export interface PromptFormProps extends BasePromptFormProps {
  prompt: unknown[];
  onChange: (prompt: unknown[]) => void;
}
