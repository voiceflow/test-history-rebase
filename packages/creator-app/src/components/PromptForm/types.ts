import { ChatModels } from '@voiceflow/chat-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceModels } from '@voiceflow/voice-types';

interface BasePromptFormProps {
  slots: Realtime.Slot[];
  autofocus?: boolean;
  placeholder: string;
}

export interface ChatPromptFormProps extends BasePromptFormProps {
  prompt: ChatModels.Prompt[];
  onChange: (prompt: ChatModels.Prompt[]) => void;
}

export interface VoicePromptFormProps extends BasePromptFormProps {
  prompt: VoiceModels.IntentPrompt<string>[];
  onChange: (prompt: VoiceModels.IntentPrompt<string>[]) => void;
}

export interface PromptFormProps extends BasePromptFormProps {
  prompt: VoiceModels.IntentPrompt<string>[] | ChatModels.Prompt[];
  onChange: (prompt: VoiceModels.IntentPrompt<string>[] | ChatModels.Prompt[]) => void;
}
