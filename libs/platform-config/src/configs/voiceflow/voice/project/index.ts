import * as Base from '@platform-config/configs/base';
import { Config as ConfigUtils } from '@platform-config/configs/utils';

import * as VoiceflowCommon from '../../common';
import * as Voice from './voice';

export const CONFIG = Base.Project.extend({
  ...VoiceflowCommon.Project.CONFIG,

  name: 'Voice Assistant',

  voice: Voice.CONFIG,
})(Base.Project.validate);

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
