import * as Platform from '@voiceflow/platform-config';

import { PlatformType } from '../constants';
import * as Base from './base';

export const CONFIG = Base.extend({
  ...Platform.Whatsapp.CONFIG,

  type: PlatformType.WHATSAPP,
});

export type Config = typeof CONFIG;
