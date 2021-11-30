import React from 'react';

import { FeatureFlag } from '@/config/features';
import { useFeature } from '@/hooks/feature';

import { createHOC, HOC } from './utils';

export const withFeatureSwitcher = <T extends object>(feature: FeatureFlag, FeatureComponent: React.ComponentType<T>): HOC<T> =>
  createHOC('withFeatureSwitcher')((Component) => (props) => {
    const { isEnabled } = useFeature(feature);

    return isEnabled ? <FeatureComponent {...props} /> : <Component {...props} />;
  });

export const withFeatureEnabled = (feature: FeatureFlag): HOC =>
  createHOC('withFeatureEnabled')((Component) => (props) => {
    const { isEnabled } = useFeature(feature);

    return isEnabled ? <Component {...props} /> : null;
  });

export const withFeatureDisabled = (feature: FeatureFlag): HOC =>
  createHOC('withFeatureDisabled')((Component) => (props) => {
    const { isEnabled } = useFeature(feature);

    return isEnabled ? null : <Component {...props} />;
  });

export const withFeatureGate = (feature: FeatureFlag): HOC =>
  createHOC('withFeatureGate')((Component) => (props) => {
    const { isEnabled } = useFeature(feature);

    return isEnabled ? <Component {...props} /> : <>{props.children}</>;
  });

export const withoutFeatureGate = (feature: FeatureFlag): HOC =>
  createHOC('withoutFeatureGate')((Component) => (props) => {
    const { isEnabled } = useFeature(feature);

    return isEnabled ? <>{props.children}</> : <Component {...props} />;
  });
