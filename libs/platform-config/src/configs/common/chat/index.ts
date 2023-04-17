import * as Base from '@platform-config/configs/base';
import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { ProjectType } from '@platform-config/constants';
import { TypeGuards } from '@platform-config/utils';

import * as Adapters from './adapters';
import * as Models from './models';
import * as Utils from './utils';

export { Adapters, Models, Utils };

export const CONFIG = Base.Type.extend({
  is: TypeGuards.isValueFactory(ProjectType.CHAT as const),

  name: 'Chat Assistant',

  type: ProjectType.CHAT,

  utils: Utils.CONFIG,

  adapters: Adapters.CONFIG,

  description: 'Chat assistants can be connected to any channel or custom interface via API.',
})(Base.Type.validate);

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
