import type * as Realtime from '@voiceflow/realtime-sdk';

export interface FeatureState {
  features: Realtime.feature.FeatureFlagMap;
  isLoaded: boolean;
}

export type FeatureFlagMap = Realtime.feature.FeatureFlagMap;
