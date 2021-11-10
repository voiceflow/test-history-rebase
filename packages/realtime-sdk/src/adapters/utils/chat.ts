import { Types as ChatTypes } from '@voiceflow/chat-types';
import { Utils } from '@voiceflow/common';
import { Types as VoiceTypes } from '@voiceflow/voice-types';
import createAdapter from 'bidirectional-adapter';

const createSlateText = (text = '') => [{ children: [{ text }] }];

// eslint-disable-next-line import/prefer-default-export
export const chatRepromptAdapter = createAdapter<ChatTypes.Prompt, ChatTypes.Prompt>(
  (reprompt: VoiceTypes.Prompt<any> | VoiceTypes.IntentPrompt<any> | ChatTypes.Prompt) => {
    // migrate from old voice reprompt types
    if ('text' in reprompt) {
      if (!reprompt.text) {
        return { id: Utils.id.cuid(), content: createSlateText() };
      }

      return { id: Utils.id.cuid(), content: createSlateText(reprompt.text) };
    }

    if (!reprompt.content) {
      return { id: Utils.id.cuid(), content: createSlateText() };
    }

    if (typeof reprompt.content === 'string') {
      return { id: Utils.id.cuid(), content: createSlateText(reprompt.content) };
    }

    return reprompt as ChatTypes.Prompt;
  },
  (reprompt) => reprompt
);
