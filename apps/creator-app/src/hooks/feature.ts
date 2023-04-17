import * as Realtime from '@voiceflow/realtime-sdk';
import { usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import { FeatureFlagsContext } from '@/contexts/FeatureFlagsContext';

export interface Feature {
  isEnabled: boolean;
}

export const useFeature = (feature: Realtime.FeatureFlag): Feature => {
  const featureState = React.useContext(FeatureFlagsContext)[feature] ?? { isEnabled: false };
  const { isEnabled } = featureState;
  return { isEnabled };
};

export const useIsFeatureEnabled = (): ((feature: Realtime.FeatureFlag) => boolean) => {
  const features = React.useContext(FeatureFlagsContext);

  return usePersistFunction((feature: Realtime.FeatureFlag) => features[feature]?.isEnabled ?? false);
};
