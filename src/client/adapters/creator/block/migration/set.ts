import { ExpressionType, ExpressionTypeV2 } from '@voiceflow/general-types';
import { StepData as SetData } from '@voiceflow/general-types/build/nodes/set';
import cuid from 'cuid';

import { NodeData } from '@/models';
import { expressionfyV2 } from '@/utils/expression';

import { createBlockAdapter } from '../utils';

const setAdapter = createBlockAdapter<SetData, NodeData.SetV2>(
  ({ sets }) => ({
    sets: sets.map(({ expression, variable }) => ({
      id: cuid.slug(),
      variable,
      type: expression.type === ExpressionType.VALUE ? ExpressionTypeV2.VALUE : ExpressionTypeV2.ADVANCE,
      expression: expressionfyV2(expression) ?? '',
    })),
  }),
  ({ sets }) => ({
    sets: sets.map(({ expression, variable }) => ({
      variable: variable ?? null,
      expression: (expression?.toString() ?? '') as any,
    })),
  })
);

export default setAdapter;
