import * as Base from '@/configs/base';
import { NLUType, PlatformType, ProjectType } from '@/constants';
import { TypeGuards } from '@/utils';

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
