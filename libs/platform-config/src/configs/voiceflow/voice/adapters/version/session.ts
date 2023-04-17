import * as Common from '@platform-config/configs/common';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

export const simple = Common.Voice.Adapters.Version.Session.simpleFactory<VoiceflowConstants.Voice>();

export const CONFIG = Common.Voice.Adapters.Version.Session.extend({
  simple,
})(Common.Voice.Adapters.Version.Session.validate);

export type Config = typeof CONFIG;
