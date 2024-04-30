import * as Base from '@/configs/base';

import * as DialogflowESCommon from '../../common';
import * as Voice from './voice';

export const CONFIG = Base.Project.extend({
  ...DialogflowESCommon.Project.CONFIG,

  name: 'Voice Assistant',

  voice: Voice.CONFIG,
})(Base.Project.validate);

export type Config = typeof CONFIG;
