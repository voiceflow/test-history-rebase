import * as Common from '@platform-config/configs/common';

import * as Version from './version';

export { Version };

export const CONFIG = Common.Chat.Adapters.extend({
  version: Version.CONFIG,
});

export type Config = typeof CONFIG;
