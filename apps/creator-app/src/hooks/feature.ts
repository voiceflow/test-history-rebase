import * as Realtime from '@voiceflow/realtime-sdk';
import { usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import { FeatureFlagsContext } from '@/contexts/FeatureFlagsContext';

export interface Feature {
  isEnabled: boolean;
}

export const useFeatures = () => {
  const featureState = React.useContext(FeatureFlagsContext);

  const allFeatures = React.useMemo(() => {
    Object.entries(featureState).reduce((acc, [featureKey, feature]) => ({ ...acc, [featureKey]: feature.isEnabled }), {});
  }, [featureState]);

  const enabledFeatures = React.useMemo(() => {
    return Object.entries(featureState).reduce<string[]>((acc, [featureKey, feature]) => {
      if (!feature.isEnabled) return acc;
      return [...acc, featureKey];
    }, []);
  }, [featureState]);

  return { allFeatures, enabledFeatures };
};

export const useFeature = (feature: Realtime.FeatureFlag): Feature => {
  const featureState = React.useContext(FeatureFlagsContext)[feature] ?? { isEnabled: false };
  const { isEnabled } = featureState;
  return { isEnabled };
};

export const useIsFeatureEnabled = (): ((feature: Realtime.FeatureFlag) => boolean) => {
  const features = React.useContext(FeatureFlagsContext);

  return usePersistFunction((feature: Realtime.FeatureFlag) => features[feature]?.isEnabled ?? false);
};
