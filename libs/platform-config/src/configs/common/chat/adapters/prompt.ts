import type { ChatModels } from '@voiceflow/chat-types';
import { Utils } from '@voiceflow/common';
import type { VoiceModels } from '@voiceflow/voice-types';
import { createMultiAdapter } from 'bidirectional-adapter';

import * as Base from '@/configs/base';
import { Config as ConfigUtils } from '@/configs/utils';

import type { Prompt } from '../models';

export const promptContentFactory = (text = '') => [{ children: [{ text }] }];
export const promptFactory = (text = ''): Prompt.Model => ({
  id: Utils.id.cuid(),
  content: promptContentFactory(text),
});

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

export const CONFIG = Base.Adapters.Prompt.extend({
  simple,
})(Base.Adapters.Prompt.validate);

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
