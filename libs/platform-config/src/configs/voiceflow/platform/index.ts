import * as Base from '@/configs/base';
import { NLUType, PlatformType, ProjectType } from '@/constants';
import { TypeGuards } from '@/utils';

import * as Chat from '../chat';
import * as Voice from '../voice';
import * as Integration from './integration';

export { Integration };
/**
 * other platforms like dialogflowCX, webchat, etc. can extend this
 */
export const CONFIG = Base.extend({
  is: TypeGuards.isValueFactory(PlatformType.VOICEFLOW),

  type: PlatformType.VOICEFLOW,

  name: 'Voiceflow',

  integration: Integration.CONFIG,

  /**
   * voiceflow nlu should always be first since it's the default
   */
  supportedNLUs: [NLUType.VOICEFLOW, ...Object.values(NLUType).filter((nlu) => nlu !== NLUType.VOICEFLOW)],

  isVoiceflowBased: true,

  types: {
    [ProjectType.CHAT]: Chat.CONFIG,
    [ProjectType.VOICE]: Voice.CONFIG,
  },
});

export type Config = typeof CONFIG;
