import * as Base from '@platform/configs/base';
import { PlatformType, ProjectType } from '@platform/constants';

import * as Chat from '../chat';
import * as Voice from '../voice';

export const CONFIG = Base.extend({
  type: PlatformType.VOICEFLOW,

  name: 'Voiceflow',

  types: {
    [ProjectType.CHAT]: Chat.CONFIG,
    [ProjectType.VOICE]: Voice.CONFIG,
  },
});

export type Config = typeof CONFIG;
