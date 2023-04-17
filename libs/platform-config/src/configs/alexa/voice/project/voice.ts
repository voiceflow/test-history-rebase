import * as Base from '@platform-config/configs/base';
import { AlexaConstants } from '@voiceflow/alexa-types';

export const CONFIG = Base.Project.Voice.extend({
  default: AlexaConstants.Voice.ALEXA,
})(Base.Project.Voice.validate);

export type Config = typeof CONFIG;
