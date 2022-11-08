import * as Base from '@platform-config/configs/base';
import { PlatformType, ProjectType } from '@platform-config/constants';

import * as Chat from '../chat';
import * as Voice from '../voice';

export const CONFIG = Base.extend({
  type: PlatformType.DIALOGFLOW_ES,

  name: 'Dialogflow ES',

  types: {
    [ProjectType.CHAT]: Chat.CONFIG,
    [ProjectType.VOICE]: Voice.CONFIG,
  },
});

export type Config = typeof CONFIG;
