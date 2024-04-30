import * as Common from '@/configs/common';
import type { ExtendableRequired } from '@/configs/types';
import { Config as ConfigUtils } from '@/configs/utils';

import * as VoiceflowCommon from '../common';
import * as Adapters from './adapters';
import * as Models from './models';
import * as Project from './project';
import * as Utils from './utils';

export { Adapters, Models, Project, Utils };

/**
 * other platforms like dialogflowCX, webchat, etc. can extend this
 */
export const CONFIG = Common.Chat.extend({
  ...VoiceflowCommon.Type.CONFIG,

  utils: Utils.CONFIG,

  project: Project.CONFIG,

  adapters: Adapters.CONFIG,
})(Common.Chat.validate);

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<ExtendableRequired<Config>>(CONFIG);
