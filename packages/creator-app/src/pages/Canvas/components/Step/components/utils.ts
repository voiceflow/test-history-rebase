import { Types as ChatTypes } from '@voiceflow/chat-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { SlateEditorAPI } from '@/components/SlateEditable';

type VoicePrompt = Realtime.NodeData.VoicePrompt;

// eslint-disable-next-line import/prefer-default-export
export const hasValidReprompt = (reprompts?: VoicePrompt[] | ChatTypes.Prompt[]): boolean => {
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
    return !!SlateEditorAPI.serialize(prompt.content);
  });
};
