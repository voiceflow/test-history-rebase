import type { StepData as IfData } from '@voiceflow/general-types/build/nodes/if';

import expressionAdapter, { expressionAdapterLegacy } from '@/client/adapters/expression';
import { FeatureFlag } from '@/config/features';
import { FeatureFlagMap } from '@/ducks/feature';
import { NodeData } from '@/models';

import { createBlockAdapter } from '../utils';

const ifAdapter = createBlockAdapter<IfData, NodeData.If, [{ features: FeatureFlagMap }], [{ features: FeatureFlagMap }]>(
  ({ expressions }, { features }) => {
    const isFeatureEnabled = features[FeatureFlag.CONDITIONS_BUILDER];

    return {
      expressions: isFeatureEnabled?.isEnabled ? expressionAdapter.mapFromDB(expressions) : expressionAdapterLegacy.mapFromDB(expressions),
    };
  },
  ({ expressions }) => ({
    expressions: expressionAdapterLegacy.mapToDB(expressions as any),
  })
);

export default ifAdapter;
