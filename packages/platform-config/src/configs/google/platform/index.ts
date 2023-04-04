import * as Base from '@platform-config/configs/base';
import { NLUType, PlatformType, ProjectType } from '@platform-config/constants';
import { TypeGuards } from '@platform-config/utils';

import * as Voice from '../voice';
import * as Components from './components';
import * as Context from './context';
import * as Integration from './integration';

export * as Constants from './constants';
export * as Types from './types';

export { Components, Context, Integration };

export const CONFIG = Base.extend({
  is: TypeGuards.isValueFactory(PlatformType.GOOGLE),

  type: PlatformType.GOOGLE,

  name: 'Google',

  Context: Context.Context,

  components: Components.CONFIG,

  integration: Integration.CONFIG,

  oneClickPublish: true,

  withThirdPartyUpload: true,

  supportedNLUs: [NLUType.GOOGLE],

  types: {
    [ProjectType.VOICE]: Voice.CONFIG,
  },
});

export type Config = typeof CONFIG;
