import * as Common from '@platform-config/configs/common';
import { AlexaConstants } from '@voiceflow/alexa-types';

export const smart = Common.Voice.Adapters.Intent.smartFactory<AlexaConstants.Voice>();

export const simple = Common.Voice.Adapters.Intent.simpleFactory<AlexaConstants.Voice>();

export const CONFIG = Common.Voice.Adapters.Intent.extend({
  smart,
  simple,
})(Common.Voice.Adapters.Intent.validate);

export type Config = typeof CONFIG;
