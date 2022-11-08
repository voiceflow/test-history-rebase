import * as Base from '@platform-config/configs/base';
import { PlatformType, ProjectType } from '@platform-config/constants';

import * as Voice from '../voice';

export const CONFIG = Base.extend({
  type: PlatformType.ALEXA,

  name: 'Alexa',

  oneClickPublish: true,

  types: {
    [ProjectType.VOICE]: Voice.CONFIG,
  },
});

export type Config = typeof CONFIG;
