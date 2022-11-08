import * as Base from '@platform-config/configs/base';
import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { ProjectType } from '@platform-config/constants';

import * as Adapters from './adapters';
import * as Models from './models';

export { Adapters, Models };

export const CONFIG = Base.Type.extend({
  name: 'Chat Assistant',

  type: ProjectType.CHAT,

  adapters: Adapters.CONFIG,

  description: 'Chat assistants can be connected to any channel or custom interface via API.',
});

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
