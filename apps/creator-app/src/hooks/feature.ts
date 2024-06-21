import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { FeatureFlagsContext } from '@/contexts/FeatureFlagsContext';

interface Feature {
  isEnabled: boolean;
}

/**
 * @deprecated use `useFeature` instead from the `@/hooks/feature.hook` file
 */
export const useFeature = (feature: Realtime.FeatureFlag): Feature => {
  const featureState = React.useContext(FeatureFlagsContext)[feature] ?? { isEnabled: false };
  const { isEnabled } = featureState;

  return { isEnabled };
};
