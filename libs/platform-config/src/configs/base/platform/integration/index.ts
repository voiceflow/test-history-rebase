import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { Types } from '@platform-config/utils';
import type React from 'react';

import * as LinkAccountButton from './link-account-button';

export { LinkAccountButton };

export interface Config {
  connectTitle: React.ReactNode;

  disconnectTitle: React.ReactNode;

  linkAccountButton: LinkAccountButton.Config;

  connectDescription: React.ReactNode;

  disconnectDescription: React.ReactNode;
}

export const CONFIG = Types.satisfies<Config>()({
  connectTitle: 'Connect to Agent',

  disconnectTitle: 'Disconnect from Agent',

  linkAccountButton: LinkAccountButton.CONFIG,

  connectDescription: 'Sign in with Voiceflow to upload your agent.',

  disconnectDescription:
    'Resetting your Voiceflow Account is potentially dangerous. Do not disconnect unless you understand the risk.',
});

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
