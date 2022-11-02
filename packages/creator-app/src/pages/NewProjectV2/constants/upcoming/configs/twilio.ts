import * as Platform from '@voiceflow/platform';

import { PlatformType } from '../constants';
import * as Base from './base';

export const CONFIG = Base.extend({
  ...Platform.Base.CONFIG,

  type: PlatformType.TWILIO,

  name: 'Twilio',

  types: {
    [Platform.Constants.ProjectType.CHAT]: { ...Platform.Common.Chat.Type.CONFIG, name: 'Twilio SMS' },
    [Platform.Constants.ProjectType.VOICE]: { ...Platform.Common.Voice.Type.CONFIG, name: 'Twilio IVR' },
  },
});

export type Config = typeof CONFIG;
