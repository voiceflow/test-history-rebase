import { ExpressionType, ExpressionTypeV2 } from '@voiceflow/general-types';
import { StepData as SetData } from '@voiceflow/general-types/build/nodes/set';
import cuid from 'cuid';

import { expressionAdapterLegacy } from '@/client/adapters/expression';
import { FeatureFlag } from '@/config/features';
import { FeatureFlagMap } from '@/ducks/feature';
import { NodeData } from '@/models';
import { expressionfyV2 } from '@/utils/expression';

import { createBlockAdapter } from '../utils';

const setAdapter = createBlockAdapter<SetData, NodeData.Set, [{ features: FeatureFlagMap }], [{ features: FeatureFlagMap }]>(
  ({ sets }, { features }) => ({
    sets: sets.map(({ expression, variable }) => ({
      id: cuid.slug(),
      variable,
      type: expression.type === ExpressionType.VALUE ? ExpressionTypeV2.VALUE : ExpressionTypeV2.ADVANCE,
      expression: features[FeatureFlag.CONDITIONS_BUILDER]?.isEnabled ? expressionfyV2(expression) || '' : expressionAdapterLegacy.fromDB(expression),
    })),
  }),
  ({ sets }, { features }) => ({
    sets: sets.map(({ expression, variable }) => ({
      variable: variable ?? null,
      expression: features[FeatureFlag.CONDITIONS_BUILDER]?.isEnabled
        ? ((expression?.toString() || '') as any)
        : expressionAdapterLegacy.toDB(expression as any),
    })),
  })
);

export default setAdapter;
