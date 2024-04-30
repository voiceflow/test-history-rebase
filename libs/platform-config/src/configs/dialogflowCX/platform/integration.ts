import * as Base from '@/configs/base';
import * as Google from '@/configs/google';

export const CONFIG = Base.Integration.extend({
  connectTitle: 'Connect to Dialogflow',

  linkAccountButton: Google.Integration.LinkAccountButton.CONFIG,

  connectDescription: 'Sign in with Google to connect this assistant to Dialogflow CX.',
})(Base.Integration.validate);

export type Config = typeof CONFIG;
