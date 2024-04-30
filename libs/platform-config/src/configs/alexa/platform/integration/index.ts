import * as Base from '@/configs/base';

import * as LinkAccountButton from './link-account-button';

export { LinkAccountButton };

export const CONFIG = Base.Integration.extend({
  connectTitle: 'Connect to Amazon',

  disconnectTitle: 'Disconnect ADC',

  linkAccountButton: LinkAccountButton.CONFIG,

  connectDescription: 'Sign in with Amazon to upload your Alexa Skill.',

  disconnectDescription:
    'Resetting your Amazon Account is potentially dangerous, as it will de-sync all your published skills & versions. Do not disconnect unless you understand the risk.',
})(Base.Integration.validate);

export type Config = typeof CONFIG;
