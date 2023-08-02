import * as Base from '@platform-config/configs/base';
import { NLUType, PlatformType, ProjectType } from '@platform-config/constants';
import { TypeGuards } from '@platform-config/utils';

import * as Voice from '../voice';
import * as Components from './components';
import * as Context from './context';
import * as Integration from './integration';

export * as Types from './types';
export { Components, Context, Integration };

export const CONFIG = Base.extend({
  is: TypeGuards.isValueFactory(PlatformType.ALEXA),

  type: PlatformType.ALEXA,

  name: 'Alexa',

  Context: Context.Context,

  components: Components.CONFIG,

  integration: Integration.CONFIG,

  supportedNLUs: [NLUType.ALEXA],

  oneClickPublish: true,

  withThirdPartyUpload: true,

  types: {
    [ProjectType.VOICE]: {
      ...Voice.CONFIG,
      description: 'Amazon Alexa Skills are no longer supported.',
    },
  },
});

export type Config = typeof CONFIG;
