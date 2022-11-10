import * as Base from '@platform-config/configs/base';
import { NLUType, PlatformType, ProjectType } from '@platform-config/constants';
import { TypeGuards } from '@platform-config/utils';

import * as Voice from '../voice';

export const CONFIG = Base.extend({
  is: TypeGuards.isValueFactory(PlatformType.ALEXA),

  type: PlatformType.ALEXA,

  name: 'Alexa',

  supportedNLUs: [NLUType.ALEXA],

  oneClickPublish: true,

  types: {
    [ProjectType.VOICE]: Voice.CONFIG,
  },
});

export type Config = typeof CONFIG;
