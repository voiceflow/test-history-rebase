import * as Platform from '@voiceflow/platform';

import { PlatformType } from '../constants';
import * as Base from './base';

export const CONFIG = Base.extend({
  ...Platform.Base.CONFIG,

  type: PlatformType.DIALOGFLOW_CX,

  name: 'Dialogflow CX',

  types: {
    [Platform.Constants.ProjectType.VOICE]: { ...Platform.Common.Voice.Type.CONFIG, name: 'Dialogflow CX' },
  },
});

export type Config = typeof CONFIG;
