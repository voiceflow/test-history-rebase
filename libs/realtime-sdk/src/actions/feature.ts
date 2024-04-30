import { Utils } from '@voiceflow/common';

import type { FeatureFlag } from '@/config/features';
import { FEATURES_KEY } from '@/constants';
import type { BaseWorkspacePayload } from '@/types';

const featureType = Utils.protocol.typeFactory(FEATURES_KEY);

export type FeatureFlagMap = Partial<Record<FeatureFlag, { isEnabled: boolean }>>;

export interface LoadAllFeatures {
  features: FeatureFlagMap;
}
export interface LoadWorkspaceFeatures extends BaseWorkspacePayload {
  features: FeatureFlagMap;
}

export const loadAll = Utils.protocol.createAction<LoadAllFeatures>(featureType('LOAD_ALL'));

export const loadWorkspaceFeatures = Utils.protocol.createAction<LoadWorkspaceFeatures>(
  featureType('LOAD_WORKSPACE_FEATURES')
);
