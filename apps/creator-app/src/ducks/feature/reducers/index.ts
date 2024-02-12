/* eslint-disable no-param-reassign */
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { IS_PRODUCTION } from '@voiceflow/ui';

import { createRootReducer } from '@/ducks/utils';

import { INITIAL_STATE } from '../constants';

export const overrideFeatures = (features: Realtime.feature.FeatureFlagMap) => {
  if (IS_PRODUCTION) return features;

  return Object.fromEntries(
    Object.entries(features).map(([key, value]) => {
      const envVar = `VF_APP_FF_${key.toUpperCase()}`;
      if (Utils.object.hasProperty(import.meta.env, envVar)) {
        return [key, { isEnabled: import.meta.env[envVar] === 'true' }];
      }

      return [key, value];
    })
  );
};

const realtimeDiagramReducer = createRootReducer(INITIAL_STATE)
  .immerCase(Realtime.feature.loadAll, (state, { features }) => {
    state.features = overrideFeatures(features);
    state.isLoaded = true;
  })
  .immerCase(Realtime.feature.loadWorkspaceFeatures, (state, { features }) => {
    state.features = overrideFeatures(features);
    state.isLoaded = true;
  })
  .build();

export default realtimeDiagramReducer;
