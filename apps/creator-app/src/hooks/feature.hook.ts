import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';
import { Tail } from 'reselect/es/types';

import { FeatureFlagsContext } from '@/contexts/FeatureFlagsContext';

import { useSelector } from './redux';

export const useFeature = (feature: Realtime.FeatureFlag): boolean =>
  React.useContext(FeatureFlagsContext)[feature]?.isEnabled ?? false;

export const createUseFeatureSelector =
  (feature: Realtime.FeatureFlag) =>
  <S1 extends (...args: any[]) => any, S2 extends (...args: any[]) => any>(selector: S1, featureSelector: S2) =>
  (...args: Tail<Parameters<S1>> | Tail<Parameters<S2>>): ReturnType<S1> | ReturnType<S2> => {
    const isEnabled = useFeature(feature);

    return isEnabled ? useSelector(featureSelector, ...args) : useSelector(selector, ...args);
  };
