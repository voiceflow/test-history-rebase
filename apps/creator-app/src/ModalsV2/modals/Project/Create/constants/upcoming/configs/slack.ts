import * as Platform from '@voiceflow/platform-config';

import { PlatformType } from '../constants';
import * as Base from './base';

export const CONFIG = Base.extend({
  ...Platform.Base.CONFIG,

  type: PlatformType.FACEBOOK,

  name: 'Slack',

  types: {
    [Platform.Constants.ProjectType.CHAT]: { ...Platform.Common.Chat.CONFIG, name: 'Slack', logo: 'slack' },
  },
});

export type Config = typeof CONFIG;
