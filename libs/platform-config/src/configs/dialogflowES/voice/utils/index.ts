import * as Common from '@/configs/common';
import { Config as ConfigUtils } from '@/configs/utils';

import * as DialogflowESCommon from '../../common';

export const CONFIG = Common.Voice.Utils.extend({
  ...DialogflowESCommon.Utils.CONFIG,
})(Common.Voice.Utils.validate);

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
