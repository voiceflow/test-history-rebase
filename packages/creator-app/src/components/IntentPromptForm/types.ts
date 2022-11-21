import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';

interface BaseIntentPromptFormProps {
  slots: Realtime.Slot[];
  autofocus?: boolean;
  placeholder: string;
}

export interface ChatIntentPromptFormProps extends BaseIntentPromptFormProps {
  prompt: Platform.Common.Chat.Models.Prompt.Model[];
  onChange: (prompt: Platform.Common.Chat.Models.Prompt.Model[]) => void;
}

export interface VoiceIntentPromptFormProps extends BaseIntentPromptFormProps {
  prompt: Platform.Common.Voice.Models.Intent.Prompt[];
  onChange: (prompt: Platform.Common.Voice.Models.Intent.Prompt[]) => void;
}

export interface IntentPromptFormProps extends BaseIntentPromptFormProps {
  prompt: unknown[];
  onChange: (prompt: unknown[]) => void;
}
