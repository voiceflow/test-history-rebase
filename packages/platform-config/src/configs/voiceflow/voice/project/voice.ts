import * as Base from '@platform-config/configs/base';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

export const CONFIG = Base.Project.Voice.extend({
  default: VoiceflowConstants.Voice.DEFAULT,
})(Base.Project.Voice.validate);

export type Config = typeof CONFIG;
