import { ChatModels } from '@voiceflow/chat-types';
import { Nullish, Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceModels } from '@voiceflow/voice-types';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { SlateEditorAPI } from '@/components/SlateEditable';
import { EditorAPI } from '@/components/SlateEditable/editor';
import { VoicePromptType } from '@/constants';

type VoicePrompt = Realtime.NodeData.VoicePrompt;

export interface PromptFactoryOptions {
  defaultVoice?: Nullish<string>;
}

export const chatPromptFactory = (): ChatModels.Prompt => ({ id: Utils.id.cuid(), content: EditorAPI.getEmptyState() });
export const voicePromptFactory = ({ defaultVoice }: PromptFactoryOptions = {}): Realtime.NodeData.VoicePrompt => ({
  id: Utils.id.cuid.slug(),
  type: VoicePromptType.TEXT,
  voice: defaultVoice ?? '',
  content: '',
});
export const voiceAudioPromptFactory = (): Realtime.NodeData.VoicePrompt => ({
  id: Utils.id.cuid.slug(),
  type: VoicePromptType.AUDIO,
  content: '',
});
export const voiceIntentPromptFactory = ({ defaultVoice }: PromptFactoryOptions = {}): VoiceModels.IntentPrompt<any> => ({
  text: '',
  slots: [],
  voice: defaultVoice,
});

export const getPlatformPromptFactory = Realtime.Utils.platform.createProjectTypeSelector<
  (options?: PromptFactoryOptions) => ChatModels.Prompt | Realtime.NodeData.VoicePrompt
>({
  [VoiceflowConstants.ProjectType.CHAT]: chatPromptFactory,
  [VoiceflowConstants.ProjectType.VOICE]: voicePromptFactory,
});

export const getPlatformIntentPromptFactory = Realtime.Utils.platform.createProjectTypeSelector<
  (options?: PromptFactoryOptions) => ChatModels.Prompt | VoiceModels.IntentPrompt<string>
>({
  [VoiceflowConstants.ProjectType.CHAT]: chatPromptFactory,
  [VoiceflowConstants.ProjectType.VOICE]: voiceIntentPromptFactory,
});

export const isEmptyPrompt = (prompt?: ChatModels.Prompt | VoicePrompt | VoiceModels.IntentPrompt<any>): boolean => {
  if (!prompt) return true;

  if ('type' in prompt) {
    if (prompt.type === Realtime.VoicePromptType.TEXT) return !prompt.content?.trim?.();
    if (prompt.type === Realtime.VoicePromptType.AUDIO) return !prompt.audio;

    return true;
  }

  if ('content' in prompt) return !SlateEditorAPI.serialize(prompt.content);
  if ('text' in prompt) return !prompt.text;

  return true;
};

export const hasValidPrompt = (prompts?: VoicePrompt[] | ChatModels.Prompt[] | VoiceModels.IntentPrompt<any>[]): boolean => {
  if (!prompts) return false;

  return prompts.some((prompt): boolean => !isEmptyPrompt(prompt));
};
