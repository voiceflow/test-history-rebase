import * as Common from '@platform-config/configs/common';

import * as DialogflowESCommon from '../common';
import * as Adapters from './adapters';
import * as Models from './models';
import * as Project from './project';

export { Adapters, Models, Project };

export const CONFIG = Common.Chat.extend({
  ...DialogflowESCommon.Type.CONFIG,

  project: Project.CONFIG,

  adapters: Adapters.CONFIG,
});

export type Config = typeof CONFIG;
