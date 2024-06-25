import type * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { useFeature } from '@/hooks/feature.hook';

import type { HOC } from './utils';
import { createHOC } from './utils';

export const withFeatureSwitcher = <T extends object>(
  feature: Realtime.FeatureFlag,
  FeatureComponent: React.ComponentType<T>
): HOC<T> =>
  createHOC('withFeatureSwitcher')((Component) => (props) => {
    const isEnabled = useFeature(feature);

    return isEnabled ? <FeatureComponent {...props} /> : <Component {...props} />;
  });

export const withFeatureEnabled = (feature: Realtime.FeatureFlag): HOC<React.PropsWithChildren> =>
  createHOC('withFeatureEnabled')((Component) => (props) => {
    const isEnabled = useFeature(feature);

    return isEnabled ? <Component {...props} /> : null;
  });

export const withFeatureDisabled = (feature: Realtime.FeatureFlag): HOC<React.PropsWithChildren> =>
  createHOC('withFeatureDisabled')((Component) => (props) => {
    const isEnabled = useFeature(feature);

    return isEnabled ? null : <Component {...props} />;
  });

export const withFeatureGate = (feature: Realtime.FeatureFlag): HOC<React.PropsWithChildren> =>
  createHOC('withFeatureGate')((Component) => (props) => {
    const isEnabled = useFeature(feature);

    return isEnabled ? <Component {...props} /> : <>{props.children}</>;
  });

export const withoutFeatureGate = (feature: Realtime.FeatureFlag): HOC<React.PropsWithChildren> =>
  createHOC('withoutFeatureGate')((Component) => (props) => {
    const isEnabled = useFeature(feature);

    return isEnabled ? <>{props.children}</> : <Component {...props} />;
  });
