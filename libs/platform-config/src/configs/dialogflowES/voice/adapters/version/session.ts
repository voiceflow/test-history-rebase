import * as Common from '@platform-config/configs/common';
import type { GoogleConstants } from '@voiceflow/google-types';

export const simple = Common.Voice.Adapters.Version.Session.simpleFactory<GoogleConstants.Voice>();

export const CONFIG = Common.Voice.Adapters.Version.Session.extend({
  simple,
})(Common.Voice.Adapters.Version.Session.validate);

export type Config = typeof CONFIG;
