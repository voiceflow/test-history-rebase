import * as Base from '@platform-config/configs/base';
import { BuiltInVariable } from '@platform-config/constants';

import * as InvocationName from './invocationName';
import * as Locale from './locale';
import * as Voice from './voice';

export { Locale, Voice };

export const CONFIG = Base.Project.extend({
  name: 'Google Action',

  voice: Voice.CONFIG,

  locale: Locale.CONFIG,

  invocationName: InvocationName.CONFIG,

  globalVariables: [...Base.Project.CONFIG.globalVariables, BuiltInVariable.LAST_UTTERANCE],
});

export type Config = typeof CONFIG;
