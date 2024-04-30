import { AlexaConstants } from '@voiceflow/alexa-types';

import * as Base from '@/configs/base';

export const CONFIG = Base.Project.Voice.extend({
  default: AlexaConstants.Voice.ALEXA,
})(Base.Project.Voice.validate);

export type Config = typeof CONFIG;
