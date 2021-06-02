import { PlatformType } from '@/constants';
import { platformAware } from '@/hocs';
import { PlatformSettingsMetaProps } from '@/pages/Settings/constants';

import { AlexaFeatures } from './components';

export type ChannelSpecificFeaturesProps = { platformMeta: PlatformSettingsMetaProps };

const ChannelSpecificFeatures = platformAware<ChannelSpecificFeaturesProps>(
  {
    [PlatformType.ALEXA]: AlexaFeatures,
  },
  () => null
);

export default ChannelSpecificFeatures;
