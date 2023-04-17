import * as Common from '@platform-config/configs/common';
import { Config as ConfigUtils } from '@platform-config/configs/utils';

import * as DialogflowESCommon from '../../common';

export const CONFIG = Common.Voice.Utils.extend({
  ...DialogflowESCommon.Utils.CONFIG,
})(Common.Voice.Utils.validate);

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
