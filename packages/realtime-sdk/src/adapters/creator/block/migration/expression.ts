import { ExpressionData as NodeDataExpressionData } from '@realtime-sdk/models';
import { ADVANCE_LOGIC_TYPES, expressionfyV2, getHighestDepth, hasAdvanceChildExpression } from '@realtime-sdk/utils/expression';
import { Node } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import createAdapter, { AdapterNotImplementedError } from 'bidirectional-adapter';

const LogicGroupConditionType: string[] = [Node.Utils.ExpressionTypeV2.AND, Node.Utils.ExpressionTypeV2.OR];

// identifies the logicInterface for older IF data
export const getLogicInterface = (expression: Node.Utils.Expression, hasParent = false): Node.Utils.ConditionsLogicInterface => {
  const valueIsArray = Array.isArray(expression.value);

  if (!valueIsArray && (expression.type === Node.Utils.ExpressionType.VALUE || ADVANCE_LOGIC_TYPES.includes(expression.type))) {
    return Node.Utils.ConditionsLogicInterface.EXPRESSION;
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
      LogicGroupConditionType.includes(expression.type)
    ) {
      return Node.Utils.ConditionsLogicInterface.LOGIC_GROUP;
    }

    if (getHighestDepth(expression) < 2 || hasParent) {
      const isVariable = (expression.value as Node.Utils.ExpressionTuple)[0].type === Node.Utils.ExpressionType.VARIABLE;

      return isVariable ? Node.Utils.ConditionsLogicInterface.VARIABLE : Node.Utils.ConditionsLogicInterface.VALUE;
    }
  }

  // any expression with depth 3 or higher or does not match above criteria is an expression
  return Node.Utils.ConditionsLogicInterface.EXPRESSION;
};

export const sanitizeExpression = (
  expression: Node.Utils.Expression,
  logicInterface: Node.Utils.ConditionsLogicInterface
): Node.Utils.ExpressionV2 | Node.Utils.LogicGroupData => {
  switch (logicInterface) {
    case Node.Utils.ConditionsLogicInterface.VARIABLE:
      if (Array.isArray(expression.value)) {
        return {
          type: expression.type as unknown as Node.Utils.ExpressionTypeV2,
          value: expression.value.map((data: any, index: number) => {
            const isSecondValueVariable = index === 1 && data.type === Node.Utils.ExpressionType.VARIABLE;

            return {
              type: data.type,
              value: isSecondValueVariable ? `{{[${data.value}].${data.value}}}` : data.value,
            };
          }),
        } as Node.Utils.ExpressionV2;
      }
      return { type: Node.Utils.ExpressionTypeV2.ADVANCE, value: expression.value } as Node.Utils.ExpressionV2;
    case Node.Utils.ConditionsLogicInterface.VALUE:
      if (Array.isArray(expression.value)) {
        return {
          type: expression.type as unknown as Node.Utils.ExpressionTypeV2,
          value: expression.value.map((data: any) => {
            const isVariable = data.type === Node.Utils.ExpressionType.VARIABLE;

            return { type: data.type, value: isVariable ? `{{[${data.value}].${data.value}}}` : data.value };
          }),
        } as Node.Utils.ExpressionV2;
      }
      return { type: Node.Utils.ExpressionTypeV2.ADVANCE, value: expression.value } as Node.Utils.ExpressionV2;
    case Node.Utils.ConditionsLogicInterface.LOGIC_GROUP:
      return {
        type: expression.type as unknown as Node.Utils.ExpressionTypeV2,
        value: (expression.value as Node.Utils.Expression[]).map((value: Node.Utils.Expression) => {
          const logic = getLogicInterface(value, true);

          return {
            id: Utils.id.cuid(),
            logicInterface: logic,
            ...sanitizeExpression(value, logic),
          };
        }),
      } as Node.Utils.LogicGroupData;
    default:
      return { type: Node.Utils.ExpressionTypeV2.ADVANCE, value: expressionfyV2(expression) } as Node.Utils.ExpressionV2;
  }
};

const expressionV1toV2Adapter = createAdapter<Node.Utils.Expression, NodeDataExpressionData>(
  (expression) => {
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
  },
  // will never be used
  () => {
    throw new AdapterNotImplementedError();
  }
);

export default expressionV1toV2Adapter;
