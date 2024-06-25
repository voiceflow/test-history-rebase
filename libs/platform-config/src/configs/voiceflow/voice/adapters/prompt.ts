import * as Common from '@platform-config/configs/common';
import type { VoiceflowConstants } from '@voiceflow/voiceflow-types';

export const simple = Common.Voice.Adapters.Prompt.simpleFactory<VoiceflowConstants.Voice>();

export const CONFIG = Common.Voice.Adapters.Prompt.extend({
  simple,
})(Common.Voice.Adapters.Prompt.validate);

export type Config = typeof CONFIG;
