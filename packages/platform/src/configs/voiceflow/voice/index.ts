import * as Common from '@platform/configs/common';

import { Type } from '../common';

export const CONFIG = Common.Voice.Type.extend({
  ...Type.CONFIG,
});

export type Config = typeof CONFIG;
