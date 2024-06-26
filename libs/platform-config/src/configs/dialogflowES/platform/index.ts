import * as Base from '@platform-config/configs/base';
import { NLUType, PlatformType, ProjectType } from '@platform-config/constants';
import { TypeGuards } from '@platform-config/utils';

import * as Chat from '../chat';
import * as Voice from '../voice';
import * as Integration from './integration';

export { Integration };

export const CONFIG = Base.extend({
  is: TypeGuards.isValueFactory(PlatformType.DIALOGFLOW_ES),

  type: PlatformType.DIALOGFLOW_ES,

  name: 'Dialogflow ES',

  integration: Integration.CONFIG,

  supportedNLUs: [NLUType.DIALOGFLOW_ES],

  withThirdPartyUpload: true,

  types: {
    [ProjectType.CHAT]: Chat.CONFIG,
    [ProjectType.VOICE]: Voice.CONFIG,
  },
});

export type Config = typeof CONFIG;
