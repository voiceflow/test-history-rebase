import React from 'react';

import { IS_PRODUCTION } from '@/config';
import { FeatureFlag, LOCAL_FEATURE_OVERRIDES } from '@/config/features';
import { FeatureFlagsContext } from '@/contexts/FeatureFlagsContext';

export interface Feature {
  isReady: boolean;
  isEnabled: boolean | null;
}

export const useFeature = (featureID: FeatureFlag): Feature => {
  const featureState = React.useContext(FeatureFlagsContext)![featureID] ?? { isEnabled: null };
  const isEnabled = (!IS_PRODUCTION && LOCAL_FEATURE_OVERRIDES[featureID]) || featureState.isEnabled;

  const isReady = isEnabled != null;

  return { isEnabled, isReady };
};
