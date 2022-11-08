import { ChatModels } from '@voiceflow/chat-types';
import { Utils } from '@voiceflow/common';
import { VoiceModels } from '@voiceflow/voice-types';
import { createMultiAdapter } from 'bidirectional-adapter';

import { Prompt } from '../models/index';

export const promptContentFactory = (text = '') => [{ children: [{ text }] }];
export const promptFactory = (text = ''): Prompt.Model => ({ id: Utils.id.cuid(), content: promptContentFactory(text) });

/**
 * converts VoicePrompt and VoiceIntentPrompt into ChatPrompt
 */
export const simple = createMultiAdapter<ChatModels.Prompt, Prompt.Model>(
  (prompt: VoiceModels.Prompt<string> | VoiceModels.IntentPrompt<string> | ChatModels.Prompt) => {
    // migrate from old voice prompt types
    if ('text' in prompt) {
      if (!prompt.text) {
        return promptFactory();
      }

      return promptFactory(prompt.text);
    }

    if (!prompt.content) {
      return promptFactory();
    }

    if (typeof prompt.content === 'string') {
      return promptFactory(prompt.content);
    }

    return prompt as ChatModels.Prompt;
  },
  (prompt) => prompt
);
