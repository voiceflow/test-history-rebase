import * as Base from '@platform/configs/base';

import * as Locale from './locale';
import * as Voice from './voice';

export const CONFIG = Base.Project.extend({
  name: 'Skill',

  voice: Voice.CONFIG,

  locale: Locale.CONFIG,

  invocationName: { name: 'Invocation Name' },
});

export type Config = typeof CONFIG;
