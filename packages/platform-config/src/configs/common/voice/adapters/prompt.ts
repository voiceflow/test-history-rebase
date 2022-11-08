import { AlexaConstants } from '@voiceflow/alexa-types';
import { Utils } from '@voiceflow/common';
import { VoiceModels } from '@voiceflow/voice-types';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import { createMultiAdapter, MultiAdapter } from 'bidirectional-adapter';

import * as Models from '../models';

export const simple = createMultiAdapter<VoiceModels.Prompt<string>, Models.Prompt.Model>(
  (reprompt) => {
    const type = reprompt.voice === VoiceflowConstants.Voice.AUDIO ? Models.Prompt.PromptType.AUDIO : Models.Prompt.PromptType.TEXT;
    const isText = type === Models.Prompt.PromptType.TEXT;

    return {
      id: Utils.id.cuid.slug(),
      type,
      desc: reprompt.desc,
      voice: isText ? reprompt.voice : null,
      audio: isText ? null : reprompt.content,
      content: isText ? reprompt.content : '',
    };
  },
  (reprompt) => ({
    desc: reprompt.desc ?? undefined,
    voice: reprompt.type === Models.Prompt.PromptType.AUDIO ? VoiceflowConstants.Voice.AUDIO : reprompt.voice ?? AlexaConstants.Voice.ALEXA,
    content: (reprompt.type === Models.Prompt.PromptType.AUDIO ? reprompt.audio : reprompt.content) ?? '',
  })
);

/**
 * Should not be used in the configs, only in the adapters to share the logic and fix TS voice related typings
 */
export const simpleFactory = <Voice extends string>() => simple as unknown as MultiAdapter<VoiceModels.Prompt<Voice>, Models.Prompt.Model<Voice>>;
