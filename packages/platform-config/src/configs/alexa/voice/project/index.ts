import * as Base from '@platform-config/configs/base';

import * as InvocationName from './invocationName';
import * as Locale from './locale';
import * as Voice from './voice';

export { InvocationName, Locale, Voice };

export const CONFIG = Base.Project.extend({
  name: 'Alexa Skill',

  voice: Voice.CONFIG,

  locale: Locale.CONFIG,

  invocationName: InvocationName.CONFIG,
});

export type Config = typeof CONFIG;
