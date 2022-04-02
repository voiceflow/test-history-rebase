import { ChatModels } from '@voiceflow/chat-types';
import { Nullish, Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceModels } from '@voiceflow/voice-types';

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

export const hasValidReprompt = (reprompts?: VoicePrompt[] | ChatModels.Prompt[] | VoiceModels.IntentPrompt<any>[]): boolean => {
  if (!reprompts) return false;

  return reprompts.some((prompt): boolean => {
    if ('type' in prompt) {
      if (prompt.type === Realtime.VoicePromptType.TEXT) {
        return !!prompt.content?.trim?.().length;
      }

      if (prompt.type === Realtime.VoicePromptType.AUDIO) {
        return !!prompt.audio;
      }
      return false;
    }

    if ('content' in prompt) {
      return !!SlateEditorAPI.serialize(prompt.content);
    }

    if ('text' in prompt) return prompt.text !== '';

    return false;
  });
};
