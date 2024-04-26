import * as Platform from '@voiceflow/platform-config';

import { platformAware } from '@/hocs/platformAware';
import type { PlatformSettingsMetaProps } from '@/pages/Settings/constants';

import { AlexaFeatures } from './components';

export interface ChannelSpecificFeaturesProps {
  platformMeta: PlatformSettingsMetaProps;
}

const ChannelSpecificFeatures = platformAware<ChannelSpecificFeaturesProps>(
  {
    [Platform.Constants.PlatformType.ALEXA]: AlexaFeatures,
  },
  () => null
);

export default ChannelSpecificFeatures;
