import * as Realtime from '@voiceflow/realtime-sdk';

import { FeatureState } from './types';

export const STATE_KEY = 'feature';

export const INITIAL_STATE: FeatureState = {
  features: {} as Realtime.feature.FeatureFlagMap,
  isLoaded: false,
};
