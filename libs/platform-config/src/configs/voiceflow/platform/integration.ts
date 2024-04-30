import * as Base from '@/configs/base';

export const CONFIG = Base.Integration.extend({
  connectTitle: 'Connect to Assistant',

  connectDescription: 'Sign in with Voiceflow to upload your assistant.',
})(Base.Integration.validate);

export type Config = typeof CONFIG;
