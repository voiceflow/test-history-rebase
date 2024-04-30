import * as Base from '@/configs/base';
import { NLUType, PlatformType, ProjectType } from '@/constants';
import { TypeGuards } from '@/utils';

import * as Chat from '../chat';
import * as Voice from '../voice';
import * as Integration from './integration';

export { Integration };

export const CONFIG = Base.extend({
  is: TypeGuards.isValueFactory(PlatformType.DIALOGFLOW_CX),

  type: PlatformType.DIALOGFLOW_CX,

  name: 'Dialogflow CX',

  integration: Integration.CONFIG,

  supportedNLUs: [NLUType.DIALOGFLOW_CX],

  withThirdPartyUpload: false,

  types: {
    [ProjectType.CHAT]: Chat.CONFIG,
    [ProjectType.VOICE]: Voice.CONFIG,
  },
});

export type Config = typeof CONFIG;
