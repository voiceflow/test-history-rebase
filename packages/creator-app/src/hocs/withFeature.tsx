import React from 'react';
import { setDisplayName, wrapDisplayName } from 'recompose';

import { FeatureFlag } from '@/config/features';
import { useFeature } from '@/hooks/feature';

export const withFeatureSwitcher =
  <T extends object>(feature: FeatureFlag, FeatureComponent: React.ComponentType<T>) =>
  (Component: React.ComponentType<T>): React.ComponentType<T> =>
    setDisplayName(wrapDisplayName(Component, 'withFeatureSwitcher'))((props) => {
      const { isEnabled } = useFeature(feature);

      return isEnabled ? <FeatureComponent {...props} /> : <Component {...props} />;
    });

export const withFeatureEnabled =
  (feature: FeatureFlag) =>
  <T extends object>(Component: React.ComponentType<T>): React.ComponentType<T> =>
    setDisplayName(wrapDisplayName(Component, 'withFeatureEnabled'))((props) => {
      const { isEnabled } = useFeature(feature);

      return isEnabled ? <Component {...props} /> : null;
    });

export const withFeatureDisabled =
  (feature: FeatureFlag) =>
  <T extends object>(Component: React.ComponentType<T>): React.ComponentType<T> =>
    setDisplayName(wrapDisplayName(Component, 'withFeatureDisabled'))((props) => {
      const { isEnabled } = useFeature(feature);

      return isEnabled ? null : <Component {...props} />;
    });

export const withFeatureGate =
  (feature: FeatureFlag) =>
  <T extends object>(Component: React.ComponentType<T>): React.ComponentType<T> =>
    setDisplayName(wrapDisplayName(Component, 'withFeatureGate'))((props) => {
      const { isEnabled } = useFeature(feature);

      return isEnabled ? <Component {...props} /> : <>{props.children}</>;
    });

export const withoutFeatureGate =
  (feature: FeatureFlag) =>
  <T extends object>(Component: React.ComponentType<T>): React.ComponentType<T> =>
    setDisplayName(wrapDisplayName(Component, 'withoutFeatureGate'))((props) => {
      const { isEnabled } = useFeature(feature);

      return isEnabled ? <>{props.children}</> : <Component {...props} />;
    });
