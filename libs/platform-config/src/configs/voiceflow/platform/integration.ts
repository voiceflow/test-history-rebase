import * as Base from '@platform-config/configs/base';

export const CONFIG = Base.Integration.extend({
  connectTitle: 'Connect to Agent',

  connectDescription: 'Sign in with Voiceflow to upload your agent.',
})(Base.Integration.validate);

export type Config = typeof CONFIG;
