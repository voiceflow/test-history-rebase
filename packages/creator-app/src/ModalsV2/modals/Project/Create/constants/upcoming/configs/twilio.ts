import * as Platform from '@voiceflow/platform-config';

import { PlatformType } from '../constants';
import * as Base from './base';

export const CONFIG = Base.extend({
  ...Platform.Base.CONFIG,

  type: PlatformType.TWILIO,

  name: 'Twilio',

  types: {
    [Platform.Constants.ProjectType.VOICE]: { ...Platform.Common.Voice.CONFIG, name: 'Twilio IVR', logo: 'twilio' },
  },
});

export type Config = typeof CONFIG;
