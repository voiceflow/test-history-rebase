import * as Platform from '@voiceflow/platform-config';

import { PlatformType } from '../constants';

export interface Config extends Omit<Platform.Base.Config, 'type'> {
  type: PlatformType;
}

export const CONFIG = Platform.Utils.Types.satisfies<Config>()({
  ...Platform.Base.CONFIG,
  type: PlatformType.TWILIO,
});

export const extend = Platform.Base.extendFactory<Config>(CONFIG);
