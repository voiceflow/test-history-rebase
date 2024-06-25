/* eslint-disable no-param-reassign */
import { BaseNode, BaseUtils } from '@voiceflow/base-types';

import type { Transform } from './types';

const SINGLE_QUOTE_PATTERN = /'/g;

export const numberOrString = (expression: string) =>
  !Number.isNaN(+expression) ? expression : `'${expression.replace(SINGLE_QUOTE_PATTERN, "\\'")}'`;

/**
 * this migration converts the set "value" type into the "advance" type
 */
const migrateToV2_6: Transform = ({ diagrams }) => {
  diagrams.forEach((dbDiagram) => {
    Object.values(dbDiagram.nodes).forEach((dbNode) => {
      if (!BaseUtils.step.isSetV2(dbNode)) return;

      dbNode.data.sets.forEach((set) => {
        if (set.type !== BaseNode.Utils.ExpressionTypeV2.VALUE) return;

        set.type = BaseNode.Utils.ExpressionTypeV2.ADVANCE;
        set.expression = numberOrString(set.expression);
      });
    });
  });
};

export default migrateToV2_6;
