import { GoogleConstants } from '@voiceflow/google-types';

import * as Base from '@/configs/base';

export const CONFIG = Base.Project.Voice.extend({
  default: GoogleConstants.Voice.DEFAULT,
})(Base.Project.Voice.validate);

export type Config = typeof CONFIG;
