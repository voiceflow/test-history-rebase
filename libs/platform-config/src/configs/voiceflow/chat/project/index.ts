import * as Base from '@/configs/base';
import { Config as ConfigUtils } from '@/configs/utils';

import * as VoiceflowCommon from '../../common';

export const CONFIG = Base.Project.extend({
  ...VoiceflowCommon.Project.CONFIG,

  name: 'Chat Assistant',
})(Base.Project.validate);

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
