import { Icon } from '@platform-config/configs/types';
import { ProjectType } from '@platform-config/constants';
import { TypeGuards, Types } from '@platform-config/utils';

import * as Project from '../project';
import * as Utils from '../utils';

/**
 * Common config shares data between project-types.
 */
export interface Config {
  is: (type?: unknown) => boolean;

  type: ProjectType;

  /**
   * used in the new project model
   * @example 'Voiceflow Assistant'
   */
  name: string;

  icon: Icon;

  logo: Icon['name'] | null;

  utils: Utils.Config;

  project: Project.Config;

  description: string;
}

export const CONFIG = Types.satisfies<Config>()({
  is: TypeGuards.isValueFactory(ProjectType.VOICE),

  type: ProjectType.VOICE,

  name: 'Voiceflow Assistant',

  icon: { name: 'voiceflowLogomark' } as Icon,

  logo: null,

  utils: Utils.CONFIG,

  project: Project.CONFIG,

  description: 'Voice assistants can be connected to any channel or custom interface via API.',
});
