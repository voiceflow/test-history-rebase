import { PlatformType } from '@/constants';
import { PlatformSettingsMetaProps } from '@/pages/Settings/constants';
import { createPlatformComponent } from '@/utils/platform';

import { AlexaFeatures } from './components';

export type ChannelSpecificFeaturesProps = { platformMeta: PlatformSettingsMetaProps };

const ChannelSpecificFeatures = createPlatformComponent<ChannelSpecificFeaturesProps>('ChannelSpecificFeatures', {
  [PlatformType.ALEXA]: AlexaFeatures,
  [PlatformType.GOOGLE]: () => null,
  [PlatformType.GENERAL]: () => null,
});

export default ChannelSpecificFeatures;
