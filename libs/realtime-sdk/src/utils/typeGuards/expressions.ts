import { BaseNode } from '@voiceflow/base-types';

import type {
  AndExpressionV2,
  ContainsExpression,
  EndsWithExpression,
  EqualsExpressionV2,
  ExpressionV2,
  GreaterExpressionV2,
  GreaterOrEqualExpression,
  HasValueExpression,
  IsEmptyExpression,
  LessExpressionV2,
  LessOrEqualExpression,
  NotContainExpression,
  NotEqualExpression,
  OrExpressionV2,
  StartsWithExpression,
  TuppleExpression,
  ValueExpressionV2,
  VariableExpressionV2,
} from '../../models/Expression';

const createExpressionTypeGuard =
  <T extends ExpressionV2>(type: BaseNode.Utils.ExpressionTypeV2) =>
  (expression?: ExpressionV2 | string): expression is T =>
    typeof expression !== 'string' && expression?.type === type;

export const isAndExpressionV2 = createExpressionTypeGuard<AndExpressionV2>(BaseNode.Utils.ExpressionTypeV2.AND);
export const isContainsExpression = createExpressionTypeGuard<ContainsExpression>(
  BaseNode.Utils.ExpressionTypeV2.CONTAINS
);
export const isEndsWithExpression = createExpressionTypeGuard<EndsWithExpression>(
  BaseNode.Utils.ExpressionTypeV2.ENDS_WITH
);
export const isEqualsExpressionV2 = createExpressionTypeGuard<EqualsExpressionV2>(
  BaseNode.Utils.ExpressionTypeV2.EQUALS
);
export const isGreaterExpressionV2 = createExpressionTypeGuard<GreaterExpressionV2>(
  BaseNode.Utils.ExpressionTypeV2.GREATER
);
export const isGreaterOrEqualExpression = createExpressionTypeGuard<GreaterOrEqualExpression>(
  BaseNode.Utils.ExpressionTypeV2.GREATER_OR_EQUAL
);
export const isHasValueExpression = createExpressionTypeGuard<HasValueExpression>(
  BaseNode.Utils.ExpressionTypeV2.HAS_VALUE
);
export const isIsEmptyExpression = createExpressionTypeGuard<IsEmptyExpression>(
  BaseNode.Utils.ExpressionTypeV2.IS_EMPTY
);
export const isLessExpressionV2 = createExpressionTypeGuard<LessExpressionV2>(BaseNode.Utils.ExpressionTypeV2.LESS);
export const isLessOrEqualExpression = createExpressionTypeGuard<LessOrEqualExpression>(
  BaseNode.Utils.ExpressionTypeV2.LESS_OR_EQUAL
);
export const isNotContainExpression = createExpressionTypeGuard<NotContainExpression>(
  BaseNode.Utils.ExpressionTypeV2.NOT_CONTAIN
);
export const isNotEqualExpression = createExpressionTypeGuard<NotEqualExpression>(
  BaseNode.Utils.ExpressionTypeV2.NOT_EQUAL
);
export const isOrExpressionV2 = createExpressionTypeGuard<OrExpressionV2>(BaseNode.Utils.ExpressionTypeV2.OR);
export const isStartsWithExpression = createExpressionTypeGuard<StartsWithExpression>(
  BaseNode.Utils.ExpressionTypeV2.STARTS_WITH
);
export const isVariableExpressionV2 = createExpressionTypeGuard<VariableExpressionV2>(
  BaseNode.Utils.ExpressionTypeV2.VARIABLE
);
export const isValueExpressionV2 = createExpressionTypeGuard<ValueExpressionV2>(BaseNode.Utils.ExpressionTypeV2.VALUE);

export const isTuppleExpression = (expression?: ExpressionV2 | string): expression is TuppleExpression => {
  return (
    typeof expression !== 'string' &&
    Boolean(
      expression?.type &&
        [
          BaseNode.Utils.ExpressionTypeV2.OR,
          BaseNode.Utils.ExpressionTypeV2.AND,
          BaseNode.Utils.ExpressionTypeV2.LESS,
          BaseNode.Utils.ExpressionTypeV2.EQUALS,
          BaseNode.Utils.ExpressionTypeV2.GREATER,
          BaseNode.Utils.ExpressionTypeV2.IS_EMPTY,
          BaseNode.Utils.ExpressionTypeV2.CONTAINS,
          BaseNode.Utils.ExpressionTypeV2.NOT_EQUAL,
          BaseNode.Utils.ExpressionTypeV2.ENDS_WITH,
          BaseNode.Utils.ExpressionTypeV2.HAS_VALUE,
          BaseNode.Utils.ExpressionTypeV2.NOT_CONTAIN,
          BaseNode.Utils.ExpressionTypeV2.STARTS_WITH,
          BaseNode.Utils.ExpressionTypeV2.LESS_OR_EQUAL,
          BaseNode.Utils.ExpressionTypeV2.GREATER_OR_EQUAL,
        ].includes(expression.type)
    )
  );
};
