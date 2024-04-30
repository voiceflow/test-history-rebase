import type { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import * as Common from '@/configs/common';

export const simple = Common.Voice.Adapters.Version.Session.simpleFactory<VoiceflowConstants.Voice>();

export const CONFIG = Common.Voice.Adapters.Version.Session.extend({
  simple,
})(Common.Voice.Adapters.Version.Session.validate);

export type Config = typeof CONFIG;
