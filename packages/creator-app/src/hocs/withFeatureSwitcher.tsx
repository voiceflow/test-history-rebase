import React from 'react';
import { setDisplayName, wrapDisplayName } from 'recompose';

import { FeatureFlag } from '@/config/features';
import { useFeature } from '@/hooks/feature';

// eslint-disable-next-line import/prefer-default-export
export const withFeatureSwitcher =
  <T extends object>(featureName: FeatureFlag, FeatureComponent: React.ComponentType<T>) =>
  (Component: React.ComponentType<T>): React.ComponentType<T> =>
    setDisplayName(wrapDisplayName(Component, 'withFeatureSwitcher'))((props) => {
      const feature = useFeature(featureName);

      return feature?.isEnabled ? <FeatureComponent {...props} /> : <Component {...props} />;
    });
