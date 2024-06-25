import * as Common from '@platform-config/configs/common';
import type { ExtendableRequired } from '@platform-config/configs/types';
import { Config as ConfigUtils } from '@platform-config/configs/utils';

import * as VoiceflowCommon from '../common';
import * as Adapters from './adapters';
import * as Models from './models';
import * as Project from './project';
import * as Utils from './utils';

export { Adapters, Models, Project, Utils };

/**
 * other platforms like dialogflowCX, webchat, etc. can extend this
 */
export const CONFIG = Common.Voice.extend({
  ...VoiceflowCommon.Type.CONFIG,

  utils: Utils.CONFIG,

  project: Project.CONFIG,

  adapters: Adapters.CONFIG,
})(Common.Voice.validate);

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<ExtendableRequired<Config>>(CONFIG);
