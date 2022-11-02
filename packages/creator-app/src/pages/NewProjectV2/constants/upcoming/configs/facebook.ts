import * as Platform from '@voiceflow/platform';

import { PlatformType } from '../constants';
import * as Base from './base';

export const CONFIG = Base.extend({
  ...Platform.Base.CONFIG,

  type: PlatformType.FACEBOOK,

  name: 'Facebook',

  types: {
    [Platform.Constants.ProjectType.CHAT]: { ...Platform.Common.Chat.Type.CONFIG, name: 'Facebook Messenger' },
  },
});

export type Config = typeof CONFIG;
