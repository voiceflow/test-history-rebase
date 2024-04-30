import type { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import * as Common from '@/configs/common';

export const simple = Common.Voice.Adapters.Prompt.simpleFactory<VoiceflowConstants.Voice>();

export const CONFIG = Common.Voice.Adapters.Prompt.extend({
  simple,
})(Common.Voice.Adapters.Prompt.validate);

export type Config = typeof CONFIG;
