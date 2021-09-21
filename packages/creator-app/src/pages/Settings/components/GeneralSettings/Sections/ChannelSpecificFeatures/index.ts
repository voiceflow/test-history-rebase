import { Constants } from '@voiceflow/general-types';

import { platformAware } from '@/hocs';
import { PlatformSettingsMetaProps } from '@/pages/Settings/constants';

import { AlexaFeatures } from './components';

export interface ChannelSpecificFeaturesProps {
  platformMeta: PlatformSettingsMetaProps;
}

const ChannelSpecificFeatures = platformAware<ChannelSpecificFeaturesProps>(
  {
    [Constants.PlatformType.ALEXA]: AlexaFeatures,
  },
  () => null
);

export default ChannelSpecificFeatures;
