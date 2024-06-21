import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';
import { Tail } from 'reselect/es/types';

import { FeatureFlagsContext } from '@/contexts/FeatureFlagsContext';

import { useSelector } from './redux';

export interface Feature {
  isEnabled: boolean;
}

export const useFeature = (feature: Realtime.FeatureFlag): Feature => {
  const featureState = React.useContext(FeatureFlagsContext)[feature] ?? { isEnabled: false };
  const { isEnabled } = featureState;

  return { isEnabled };
};

export const createUseFeatureSelector =
  (feature: Realtime.FeatureFlag) =>
  <S1 extends (...args: any[]) => any, S2 extends (...args: any[]) => any>(selector: S1, featureSelector: S2) =>
  (...args: Tail<Parameters<S1>> | Tail<Parameters<S2>>): ReturnType<S1> | ReturnType<S2> => {
    const featureFlag = useFeature(feature);

    if (featureFlag.isEnabled) {
      return useSelector(featureSelector, ...args);
    }

    return useSelector(selector, ...args);
  };
