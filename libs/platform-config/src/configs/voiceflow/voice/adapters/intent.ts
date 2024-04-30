import type { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import * as Common from '@/configs/common';

export const smart = Common.Voice.Adapters.Intent.smartFactory<VoiceflowConstants.Voice>();

export const simple = Common.Voice.Adapters.Intent.simpleFactory<VoiceflowConstants.Voice>();

export const CONFIG = Common.Voice.Adapters.Intent.extend({
  smart,
  simple,
})(Common.Voice.Adapters.Intent.validate);

export type Config = typeof CONFIG;
