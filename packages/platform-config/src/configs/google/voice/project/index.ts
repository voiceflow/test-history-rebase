import * as Base from '@platform-config/configs/base';
import { BuiltInVariable } from '@platform-config/constants';

import * as Voice from './voice';

export const CONFIG = Base.Project.extend({
  name: 'Google Action',

  voice: Voice.CONFIG,

  invocationName: { name: 'Invocation Name' },

  globalVariables: [...Base.Project.CONFIG.globalVariables, BuiltInVariable.LAST_UTTERANCE],
});

export type Config = typeof CONFIG;
