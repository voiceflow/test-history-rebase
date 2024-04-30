import * as Common from '@/configs/common';

import * as Version from './version';

export { Version };

export const CONFIG = Common.Chat.Adapters.extend({
  version: Version.CONFIG,
})(Common.Chat.Adapters.validate);

export type Config = typeof CONFIG;
