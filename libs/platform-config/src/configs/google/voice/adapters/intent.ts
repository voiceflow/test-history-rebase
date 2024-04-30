import type { GoogleConstants } from '@voiceflow/google-types';

import * as Common from '@/configs/common';

export const smart = Common.Voice.Adapters.Intent.smartFactory<GoogleConstants.Voice>();

export const simple = Common.Voice.Adapters.Intent.simpleFactory<GoogleConstants.Voice>();

export const CONFIG = Common.Voice.Adapters.Intent.extend({
  smart,
  simple,
})(Common.Voice.Adapters.Intent.validate);

export type Config = typeof CONFIG;
