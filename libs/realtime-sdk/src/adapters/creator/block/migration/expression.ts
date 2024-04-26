import type { ExpressionData as NodeDataExpressionData } from '@realtime-sdk/models';
import {
  ADVANCE_LOGIC_TYPES,
  expressionfyV2,
  getHighestDepth,
  hasAdvanceChildExpression,
} from '@realtime-sdk/utils/expression';
import { BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';

const LogicGroupConditionType = new Set<string>([
  BaseNode.Utils.ExpressionTypeV2.AND,
  BaseNode.Utils.ExpressionTypeV2.OR,
]);

// identifies the logicInterface for older IF data
export const getLogicInterface = (
  expression: BaseNode.Utils.Expression,
  hasParent = false
): BaseNode.Utils.ConditionsLogicInterface => {
  const valueIsArray = Array.isArray(expression.value);

  if (
    !valueIsArray &&
    (expression.type === BaseNode.Utils.ExpressionType.VALUE || ADVANCE_LOGIC_TYPES.includes(expression.type))
  ) {
    return BaseNode.Utils.ConditionsLogicInterface.EXPRESSION;
  }

  if (valueIsArray && !ADVANCE_LOGIC_TYPES.includes(expression.type)) {
    /**
     * 1. Logic Group cannot have a parent
     * 2. Expressions with depth of only 2 can be a logic group
     * 3. Inner logic should NOT be of type advance, not, minus, plus, divide, multiply
     * 4. Base condition of logic group can only be AND or OR
     */
    if (
      !hasParent &&
      getHighestDepth(expression) === 2 &&
      !hasAdvanceChildExpression(expression) &&
      LogicGroupConditionType.has(expression.type)
    ) {
      return BaseNode.Utils.ConditionsLogicInterface.LOGIC_GROUP;
    }

    if (getHighestDepth(expression) < 2 || hasParent) {
      const isVariable =
        (expression.value as BaseNode.Utils.ExpressionTuple)[0].type === BaseNode.Utils.ExpressionType.VARIABLE;

      return isVariable
        ? BaseNode.Utils.ConditionsLogicInterface.VARIABLE
        : BaseNode.Utils.ConditionsLogicInterface.VALUE;
    }
  }

  // any expression with depth 3 or higher or does not match above criteria is an expression
  return BaseNode.Utils.ConditionsLogicInterface.EXPRESSION;
};

export const sanitizeExpression = (
  expression: BaseNode.Utils.Expression,
  logicInterface: BaseNode.Utils.ConditionsLogicInterface
): BaseNode.Utils.ExpressionV2 | BaseNode.Utils.LogicGroupData => {
  switch (logicInterface) {
    case BaseNode.Utils.ConditionsLogicInterface.VARIABLE:
      if (Array.isArray(expression.value)) {
        return {
          type: expression.type as unknown as BaseNode.Utils.ExpressionTypeV2,
          value: expression.value.map((data: any, index: number) => {
            const isSecondValueVariable = index === 1 && data.type === BaseNode.Utils.ExpressionType.VARIABLE;

            return {
              type: data.type,
              value: isSecondValueVariable ? `{{[${data.value}].${data.value}}}` : data.value,
            };
          }),
        } as BaseNode.Utils.ExpressionV2;
      }
      return { type: BaseNode.Utils.ExpressionTypeV2.ADVANCE, value: expression.value } as BaseNode.Utils.ExpressionV2;
    case BaseNode.Utils.ConditionsLogicInterface.VALUE:
      if (Array.isArray(expression.value)) {
        return {
          type: expression.type as unknown as BaseNode.Utils.ExpressionTypeV2,
          value: expression.value.map((data: any) => {
            const isVariable = data.type === BaseNode.Utils.ExpressionType.VARIABLE;

            return { type: data.type, value: isVariable ? `{{[${data.value}].${data.value}}}` : data.value };
          }),
        } as BaseNode.Utils.ExpressionV2;
      }
      return { type: BaseNode.Utils.ExpressionTypeV2.ADVANCE, value: expression.value } as BaseNode.Utils.ExpressionV2;
    case BaseNode.Utils.ConditionsLogicInterface.LOGIC_GROUP:
      return {
        type: expression.type as unknown as BaseNode.Utils.ExpressionTypeV2,
        value: (expression.value as BaseNode.Utils.Expression[]).map((value: BaseNode.Utils.Expression) => {
          const logic = getLogicInterface(value, true);

          return {
            id: Utils.id.cuid(),
            logicInterface: logic,
            ...sanitizeExpression(value, logic),
          };
        }),
      } as BaseNode.Utils.LogicGroupData;
    default:
      return {
        type: BaseNode.Utils.ExpressionTypeV2.ADVANCE,
        value: expressionfyV2(expression),
      } as BaseNode.Utils.ExpressionV2;
  }
};

const expressionV1toV2Adapter = createMultiAdapter<BaseNode.Utils.Expression, NodeDataExpressionData>((expression) => {
  const logicInterface = getLogicInterface(expression);

  return {
    id: Utils.id.cuid(),
    type: null,
    value: [
      {
        id: Utils.id.cuid(),
        logicInterface,
        ...sanitizeExpression(expression, logicInterface),
      },
    ],
  } as NodeDataExpressionData;
}, notImplementedAdapter.transformer);

export default expressionV1toV2Adapter;
