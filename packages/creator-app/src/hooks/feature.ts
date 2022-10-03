import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { FeatureFlagsContext } from '@/contexts/FeatureFlagsContext';

export interface Feature {
  isEnabled: boolean;
}

const localOverrides: Realtime.FeatureFlag[] = [Realtime.FeatureFlag.NLU_MANAGER, Realtime.FeatureFlag.ML_GATEWAY_INTEGRATION];

export const useFeature = (featureID: Realtime.FeatureFlag): Feature => {
  const featureState = React.useContext(FeatureFlagsContext)![featureID] ?? { isEnabled: false };
  const { isEnabled } = featureState;

  if (localOverrides.includes(featureID)) {
    return { isEnabled: true };
  }

  return { isEnabled };
};
