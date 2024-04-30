import * as Common from '@/configs/common';
import { Config as ConfigUtils } from '@/configs/utils';

import * as DialogflowESCommon from '../../common';

export const CONFIG = Common.Chat.Utils.extend({
  ...DialogflowESCommon.Utils.CONFIG,
})(Common.Chat.Utils.validate);

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
