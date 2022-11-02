import * as Platform from '@voiceflow/platform';

import { PlatformType } from '../constants';
import * as Base from './base';

export const CONFIG = Base.extend({
  ...Platform.Base.CONFIG,

  type: PlatformType.WHATSAPP,

  name: 'Whatsapp',

  types: {
    [Platform.Constants.ProjectType.CHAT]: { ...Platform.Common.Chat.Type.CONFIG, name: 'Whatsapp' },
  },
});

export type Config = typeof CONFIG;
