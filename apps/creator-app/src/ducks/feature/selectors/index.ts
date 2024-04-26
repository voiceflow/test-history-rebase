import type * as Realtime from '@voiceflow/realtime-sdk';
import { createSelector } from 'reselect';

import { createRootSelector } from '@/ducks/utils';

import { STATE_KEY } from '../constants';

export const rootSelector = createRootSelector(STATE_KEY);

export const featuresSelector = createSelector([rootSelector], ({ features }) => features);

export const featureSelector = createSelector(
  [featuresSelector],
  (features) => (featureID: Realtime.FeatureFlag) => features[featureID] ?? { isEnabled: false }
);

export const allActiveFeaturesSelector = createSelector([rootSelector], ({ features }) => features);

export const isFeatureEnabledSelector = createSelector(
  [featureSelector],
  (getFeature) => (featureID: Realtime.FeatureFlag) => getFeature(featureID).isEnabled
);

export const featureSelectorFactory =
  (feature: Realtime.FeatureFlag) =>
  <S1 extends (state: any) => any, S2 extends (state: any) => any>(selector: S1, featureSelector: S2) =>
    createSelector([isFeatureEnabledSelector, selector, featureSelector], (isFeatureEnabled, value1, value2) =>
      isFeatureEnabled(feature) ? value2 : value1
    );

export const isLoadedSelector = createSelector([rootSelector], ({ isLoaded }) => isLoaded);
