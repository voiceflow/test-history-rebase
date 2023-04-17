import * as Common from '@platform-config/configs/common';

import * as DialogflowESCommon from '../common';
import * as Adapters from './adapters';
import * as Models from './models';
import * as Project from './project';
import * as Utils from './utils';

export { Adapters, Models, Project, Utils };

export const CONFIG = Common.Chat.extend({
  ...DialogflowESCommon.Type.CONFIG,

  utils: Utils.CONFIG,

  project: Project.CONFIG,

  adapters: Adapters.CONFIG,
})(Common.Chat.validate);

export type Config = typeof CONFIG;
