import { useSelector } from 'react-redux';

import { FeatureFlag } from '@/config/features';
import { PlatformType } from '@/constants';
import * as Feature from '@/ducks/feature';
import * as Skill from '@/ducks/skill';

// eslint-disable-next-line import/prefer-default-export
export const useFeature = (featureID: FeatureFlag) => {
  const isEnabled = useSelector(Feature.isFeatureEnabledSelector)(featureID);
  const isReady = isEnabled != null;

  return { isEnabled, isReady };
};

// TEMPORARY
export const useGeneralPrototype = () => {
  const platform = useSelector(Skill.activePlatformSelector);
  const ff = useFeature(FeatureFlag.GENERAL_PROTOTYPE);

  return {
    ...ff,
    isEnabled: !!(platform === PlatformType.GENERAL && ff.isEnabled),
  };
};
