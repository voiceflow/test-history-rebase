import * as Common from '@platform-config/configs/common';
import type { AlexaConstants } from '@voiceflow/alexa-types';

export const simple = Common.Voice.Adapters.Version.Session.simpleFactory<AlexaConstants.Voice>();

export const CONFIG = Common.Voice.Adapters.Version.Session.extend({
  simple,
})(Common.Voice.Adapters.Version.Session.validate);

export type Config = typeof CONFIG;
