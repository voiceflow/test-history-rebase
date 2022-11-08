import * as Common from '@platform-config/configs/common';
import { Config as ConfigUtils } from '@platform-config/configs/utils';

import * as VoiceflowCommon from '../common';
import * as Adapters from './adapters';
import * as Models from './models';
import * as Project from './project';

export { Adapters, Models, Project };

/**
 * other platforms like dialogflowCX, webchat, etc. can extend this
 */
export const CONFIG = Common.Chat.extend({
  ...VoiceflowCommon.Type.CONFIG,

  project: Project.CONFIG,

  adapters: Adapters.CONFIG,
});

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
