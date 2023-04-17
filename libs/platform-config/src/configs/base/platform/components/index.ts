import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { Types } from '@platform-config/utils';

import * as ConnectButton from './connect-button';

export { ConnectButton };

export interface Config {
  ConnectButton: ConnectButton.Config;
}

export const CONFIG = Types.satisfies<Config>()({
  ConnectButton: ConnectButton.CONFIG,
});

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
