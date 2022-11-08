import * as Base from '@platform-config/configs/base';
import { PlatformType, ProjectType } from '@platform-config/constants';

import * as Chat from '../chat';
import * as Voice from '../voice';

/**
 * other platforms like dialogflowCX, webchat, etc. can extend this
 */
export const CONFIG = Base.extend({
  type: PlatformType.VOICEFLOW,

  name: 'Voiceflow',

  types: {
    [ProjectType.CHAT]: Chat.CONFIG,
    [ProjectType.VOICE]: Voice.CONFIG,
  },
});

export type Config = typeof CONFIG;
