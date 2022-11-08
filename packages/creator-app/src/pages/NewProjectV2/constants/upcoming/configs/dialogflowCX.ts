import * as Platform from '@voiceflow/platform-config';

import { PlatformType } from '../constants';
import * as Base from './base';

export const CONFIG = Base.extend({
  ...Platform.Base.CONFIG,

  type: PlatformType.DIALOGFLOW_CX,

  name: 'Dialogflow CX',

  types: {
    [Platform.Constants.ProjectType.VOICE]: { ...Platform.Common.Voice.CONFIG, name: 'Dialogflow CX' },
  },
});

export type Config = typeof CONFIG;
