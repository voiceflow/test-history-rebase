import * as Base from '@platform-config/configs/base';

import * as DialogflowESCommon from '../../common';

export const CONFIG = Base.Project.extend({
  ...DialogflowESCommon.Project.CONFIG,

  name: 'Chat Agent',
})(Base.Project.validate);

export type Config = typeof CONFIG;
