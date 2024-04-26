import type { NodeData } from '@realtime-sdk/models';
import { expressionfyV2, sanitizeSetValue } from '@realtime-sdk/utils/expression';
import { BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';

import { createBlockAdapter } from '../utils';

const setAdapter = createBlockAdapter<BaseNode.Set.StepData, NodeData.SetV2>(
  ({ sets }) => ({
    sets: sets.map(({ expression, variable }) => ({
      id: Utils.id.cuid.slug(),
      variable,
      type:
        expression.type === BaseNode.Utils.ExpressionType.VALUE
          ? BaseNode.Utils.ExpressionTypeV2.VALUE
          : BaseNode.Utils.ExpressionTypeV2.ADVANCE,
      expression:
        sanitizeSetValue(
          String(expressionfyV2(expression)),
          expression.type as unknown as BaseNode.Utils.ExpressionTypeV2
        ) ?? '',
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
