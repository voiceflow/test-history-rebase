import type * as Base from '@/configs/base';
import { Config as ConfigUtils } from '@/configs/utils';

export const CONFIG = ConfigUtils.partialSatisfies<Base.Type.Common.Config>()({
  icon: {
    name: 'voiceflowLogomark',
    color: '#132144',
  },
});
