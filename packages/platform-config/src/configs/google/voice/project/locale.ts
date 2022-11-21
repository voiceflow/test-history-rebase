import * as Base from '@platform-config/configs/base';

export const CONFIG = Base.Project.Locale.extend({
  storedIn: 'publishing',
});

export type Config = typeof CONFIG;
