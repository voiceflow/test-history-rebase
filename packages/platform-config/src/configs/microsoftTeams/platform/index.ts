import * as Base from '@platform-config/configs/base';
import { NLUType, PlatformType, ProjectType } from '@platform-config/constants';
import { TypeGuards } from '@platform-config/utils';

import * as Chat from '../chat';

export const CONFIG = Base.extend({
  is: TypeGuards.isValueFactory(PlatformType.MICROSOFT_TEAMS),

  type: PlatformType.MICROSOFT_TEAMS,

  name: 'Microsoft Teams',

  supportedNLUs: [NLUType.VOICEFLOW],

  oneClickPublish: true,

  isVoiceflowBased: true,

  types: {
    [ProjectType.CHAT]: Chat.CONFIG,
  },
});

export type Config = typeof CONFIG;
