import * as Base from '@/configs/base';

import * as ConnectButton from './connect-button';

export { ConnectButton };

export const CONFIG = Base.Components.extend({
  ConnectButton: ConnectButton.CONFIG,
})(Base.Components.validate);

export type Config = typeof CONFIG;
