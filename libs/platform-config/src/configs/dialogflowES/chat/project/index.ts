import * as Base from '@/configs/base';

import * as DialogflowESCommon from '../../common';

export const CONFIG = Base.Project.extend({
  ...DialogflowESCommon.Project.CONFIG,

  name: 'Chat Assistant',
})(Base.Project.validate);

export type Config = typeof CONFIG;
