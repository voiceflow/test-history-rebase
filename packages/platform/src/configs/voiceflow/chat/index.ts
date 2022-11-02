import * as Common from '@platform/configs/common';

import { Type } from '../common';

export const CONFIG = Common.Chat.Type.extend({
  ...Type.CONFIG,
});

export type Config = typeof CONFIG;
