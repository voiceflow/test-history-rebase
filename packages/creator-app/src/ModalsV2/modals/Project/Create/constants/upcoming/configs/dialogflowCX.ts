import * as Platform from '@voiceflow/platform-config';

import { PlatformType } from '../constants';
import * as Base from './base';

export const CONFIG = Base.extend({
  ...Platform.DialogflowCX.CONFIG,

  type: PlatformType.DIALOGFLOW_CX,
});

export type Config = typeof CONFIG;
