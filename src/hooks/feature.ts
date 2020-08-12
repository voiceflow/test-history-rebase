import { useSelector } from 'react-redux';

import { FeatureFlag } from '@/config/features';
import * as Feature from '@/ducks/feature';

// eslint-disable-next-line import/prefer-default-export
export const useFeature = (featureID: FeatureFlag) => {
  const isEnabled = useSelector(Feature.isFeatureEnabledSelector)(featureID);
  const isReady = isEnabled != null;

  return { isEnabled, isReady };
};
