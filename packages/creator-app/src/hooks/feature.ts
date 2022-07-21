import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { FeatureFlagsContext } from '@/contexts/FeatureFlagsContext';

export interface Feature {
  isEnabled: boolean;
}

export const useFeature = (featureID: Realtime.FeatureFlag): Feature => {
  const featureState = React.useContext(FeatureFlagsContext)![featureID] ?? { isEnabled: false };
  const { isEnabled } = featureState;

  return { isEnabled };
};
