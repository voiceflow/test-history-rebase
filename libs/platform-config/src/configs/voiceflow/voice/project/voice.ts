import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import * as Base from '@/configs/base';

export const CONFIG = Base.Project.Voice.extend({
  default: VoiceflowConstants.Voice.DEFAULT,
})(Base.Project.Voice.validate);

export type Config = typeof CONFIG;
