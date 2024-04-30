import * as Base from '@/configs/base';

import * as LinkAccountButton from './link-account-button';

export { LinkAccountButton };

export const CONFIG = Base.Integration.extend({
  connectTitle: 'Connect to Google',

  disconnectTitle: 'Disconnect Google',

  linkAccountButton: LinkAccountButton.CONFIG,

  connectDescription: 'Sign in with Google to upload your assistant.',

  disconnectDescription:
    'Resetting your Google account is potentially dangerous, as it will de-sync all your published assistants & versions. Do not disconnect unless you understand the risk.',
})(Base.Integration.validate);

export type Config = typeof CONFIG;
