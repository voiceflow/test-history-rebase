import * as Base from '@platform/configs/base';
import { PlatformType, ProjectType } from '@platform/constants';

import * as Voice from '../voice';

export const CONFIG = Base.extend({
  type: PlatformType.GOOGLE,

  name: 'Google',

  oneClickPublish: true,

  types: {
    [ProjectType.VOICE]: Voice.CONFIG,
  },
});

export type Config = typeof CONFIG;
