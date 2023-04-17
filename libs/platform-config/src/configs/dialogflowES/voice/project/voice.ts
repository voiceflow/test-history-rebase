import * as Base from '@platform-config/configs/base';
import { GoogleConstants } from '@voiceflow/google-types';

export const CONFIG = Base.Project.Voice.extend({
  default: GoogleConstants.Voice.DEFAULT,
})(Base.Project.Voice.validate);

export type Config = typeof CONFIG;
