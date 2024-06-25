import * as Common from '@platform-config/configs/common';
import type { AlexaConstants } from '@voiceflow/alexa-types';

export const simple = Common.Voice.Adapters.Prompt.simpleFactory<AlexaConstants.Voice>();

export const CONFIG = Common.Voice.Adapters.Prompt.extend({
  simple,
})(Common.Voice.Adapters.Prompt.validate);

export type Config = typeof CONFIG;
