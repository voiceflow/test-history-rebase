import { useSelector } from 'react-redux';

import { FeatureFlag } from '@/config/features';
import * as Feature from '@/ducks/feature';

// eslint-disable-next-line import/prefer-default-export
export const useFeature = (featureID) => {
  const isBlockRedesign = featureID === FeatureFlag.BLOCK_REDESIGN;
  const featureState = useSelector(isBlockRedesign ? Feature.isBlockRedesignEnabledSelector : Feature.isFeatureEnabledSelector);
  const isEnabled = isBlockRedesign ? featureState : featureState(featureID);
  const isReady = isEnabled != null;

  return { isEnabled, isReady };
};
