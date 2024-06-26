import * as Base from '@platform-config/configs/base';

import * as DialogflowESCommon from '../../common';
import * as Voice from './voice';

export const CONFIG = Base.Project.extend({
  ...DialogflowESCommon.Project.CONFIG,

  name: 'Voice Agent',

  voice: Voice.CONFIG,
})(Base.Project.validate);

export type Config = typeof CONFIG;
