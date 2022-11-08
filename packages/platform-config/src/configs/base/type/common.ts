import { Icon } from '@platform-config/configs/types';
import { ProjectType } from '@platform-config/constants';
import { Types } from '@platform-config/utils';

import * as Project from '../project';
import * as Utils from '../utils';

/**
 * Common config shares data between project-types.
 */
export interface Config {
  type: ProjectType;

  /**
   * @example 'Voiceflow Assistant'
   */
  name: string;

  icon: Icon;

  utils: Utils.Config;

  project: Project.Config;

  description: string;
}

export const CONFIG = Types.satisfies<Config>()({
  type: ProjectType.VOICE,

  name: 'Voiceflow Assistant',

  icon: { name: 'voiceflowV', color: '#00a0ff' } as Icon,

  utils: Utils.CONFIG,

  project: Project.CONFIG,

  description: 'Voice assistants can be connected to any channel or custom interface via API.',
});
