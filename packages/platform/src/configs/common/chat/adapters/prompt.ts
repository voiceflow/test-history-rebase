import { ChatModels } from '@voiceflow/chat-types';
import { Utils } from '@voiceflow/common';
import { VoiceModels } from '@voiceflow/voice-types';
import { createMultiAdapter } from 'bidirectional-adapter';

import { Prompt } from '../models/index';

const createSlateText = (text = '') => [{ children: [{ text }] }];

/**
 * converts VoicePrompt and VoiceIntentPrompt into ChatPrompt
 */
export const simple = createMultiAdapter<ChatModels.Prompt, Prompt.Model>(
  (prompt: VoiceModels.Prompt<string> | VoiceModels.IntentPrompt<string> | ChatModels.Prompt) => {
    // migrate from old voice prompt types
    if ('text' in prompt) {
      if (!prompt.text) {
        return { id: Utils.id.cuid(), content: createSlateText() };
      }

      return { id: Utils.id.cuid(), content: createSlateText(prompt.text) };
    }

    if (!prompt.content) {
      return { id: Utils.id.cuid(), content: createSlateText() };
    }

    if (typeof prompt.content === 'string') {
      return { id: Utils.id.cuid(), content: createSlateText(prompt.content) };
    }

    return prompt as ChatModels.Prompt;
  },
  (prompt) => prompt
);
