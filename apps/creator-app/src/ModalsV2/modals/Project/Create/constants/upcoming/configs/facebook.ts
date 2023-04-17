import * as Platform from '@voiceflow/platform-config';

import { PlatformType } from '../constants';
import * as Base from './base';

export const CONFIG = Base.extend({
  ...Platform.Base.CONFIG,

  type: PlatformType.FACEBOOK,

  name: 'Facebook',

  types: {
    [Platform.Constants.ProjectType.CHAT]: { ...Platform.Common.Chat.CONFIG, name: 'Facebook Messenger', logo: 'messenger' },
  },
});

export type Config = typeof CONFIG;
