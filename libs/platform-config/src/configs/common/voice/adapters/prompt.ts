import * as Base from '@platform-config/configs/base';
import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { AlexaConstants } from '@voiceflow/alexa-types';
import { Utils } from '@voiceflow/common';
import { VoiceModels } from '@voiceflow/voice-types';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import { createMultiAdapter, MultiAdapter } from 'bidirectional-adapter';

import * as Models from '../models';

export const simple = createMultiAdapter<VoiceModels.Prompt<string>, Models.Prompt.Model>(
  (prompt) => {
    const type = prompt.voice === VoiceflowConstants.Voice.AUDIO ? Models.Prompt.PromptType.AUDIO : Models.Prompt.PromptType.TEXT;
    const isText = type === Models.Prompt.PromptType.TEXT;

    return {
      id: Utils.id.cuid.slug(),
      type,
      desc: prompt.desc,
      voice: isText ? prompt.voice : null,
      audio: isText ? null : prompt.content,
      content: isText ? prompt.content : '',
    };
  },
  (prompt) => ({
    desc: prompt.desc ?? undefined,
    voice: prompt.type === Models.Prompt.PromptType.AUDIO ? VoiceflowConstants.Voice.AUDIO : prompt.voice ?? AlexaConstants.Voice.ALEXA,
    content: (prompt.type === Models.Prompt.PromptType.AUDIO ? prompt.audio : prompt.content) ?? '',
  })
);

export const CONFIG = Base.Adapters.Prompt.extend({
  simple,
})(Base.Adapters.Prompt.validate);

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);

/**
 * Should not be used in the configs, only in the adapters to share the logic and fix TS voice related typings
 */
export const simpleFactory = <Voice extends string>() => simple as unknown as MultiAdapter<VoiceModels.Prompt<Voice>, Models.Prompt.Model<Voice>>;
