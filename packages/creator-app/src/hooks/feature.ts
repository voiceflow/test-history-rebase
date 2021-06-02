import React from 'react';

import { IS_PRODUCTION } from '@/config';
import { FeatureFlag, LOCAL_FEATURE_OVERRIDES } from '@/config/features';
import { FeatureFlagsContext } from '@/contexts';

// eslint-disable-next-line import/prefer-default-export
export const useFeature = (featureID: FeatureFlag) => {
  const featureState = React.useContext(FeatureFlagsContext)![featureID] ?? { isEnabled: null };
  const isEnabled = (!IS_PRODUCTION && LOCAL_FEATURE_OVERRIDES[featureID]) || featureState.isEnabled;

  const isReady = isEnabled != null;

  return { isEnabled, isReady };
};
