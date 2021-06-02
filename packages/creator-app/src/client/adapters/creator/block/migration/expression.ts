import {
  ConditionsLogicInterface,
  Expression,
  ExpressionTuple,
  ExpressionType,
  ExpressionTypeV2,
  ExpressionV2,
  LogicGroupData,
} from '@voiceflow/general-types';
import cuid from 'cuid';

import { AdapterNotImplementedError, createAdapter } from '@/client/adapters/utils';
import { ExpressionData as NodeDataExpressionData } from '@/models';
import { ADVANCE_LOGIC_TYPES, expressionfyV2, getHighestDepth, hasAdvanceChildExpression } from '@/utils/expression';

const LogicGroupConditionType: string[] = [ExpressionTypeV2.AND, ExpressionTypeV2.OR];

// identifies the logicInterface for older IF data
export const getLogicInterface = (expression: Expression, hasParent = false): ConditionsLogicInterface => {
  const valueIsArray = Array.isArray(expression.value);

  if (!valueIsArray && (expression.type === ExpressionType.VALUE || ADVANCE_LOGIC_TYPES.includes(expression.type))) {
    return ConditionsLogicInterface.EXPRESSION;
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
      return ConditionsLogicInterface.LOGIC_GROUP;
    }

    if (getHighestDepth(expression) < 2 || hasParent) {
      const isVariable = (expression.value as ExpressionTuple)[0].type === ExpressionType.VARIABLE;

      return isVariable ? ConditionsLogicInterface.VARIABLE : ConditionsLogicInterface.VALUE;
    }
  }

  // any expression with depth 3 or higher or does not match above criteria is an expression
  return ConditionsLogicInterface.EXPRESSION;
};

export const sanitizeExpression = (expression: Expression, logicInterface: ConditionsLogicInterface): ExpressionV2 | LogicGroupData => {
  switch (logicInterface) {
    case ConditionsLogicInterface.VARIABLE:
      if (Array.isArray(expression.value)) {
        return {
          type: expression.type as unknown as ExpressionTypeV2,
          value: expression.value.map((data: any, index: number) => {
            const isSecondValueVariable = index === 1 && data.type === ExpressionType.VARIABLE;

            return {
              type: data.type,
              value: isSecondValueVariable ? `{{[${data.value}].${data.value}}}` : data.value,
            };
          }),
        } as ExpressionV2;
      }
      return { type: ExpressionTypeV2.ADVANCE, value: expression.value } as ExpressionV2;
    case ConditionsLogicInterface.VALUE:
      if (Array.isArray(expression.value)) {
        return {
          type: expression.type as unknown as ExpressionTypeV2,
          value: expression.value.map((data: any) => {
            const isVariable = data.type === ExpressionType.VARIABLE;

            return { type: data.type, value: isVariable ? `{{[${data.value}].${data.value}}}` : data.value };
          }),
        } as ExpressionV2;
      }
      return { type: ExpressionTypeV2.ADVANCE, value: expression.value } as ExpressionV2;
    case ConditionsLogicInterface.LOGIC_GROUP:
      return {
        type: expression.type as unknown as ExpressionTypeV2,
        value: (expression.value as Expression[]).map((value: Expression) => {
          const logic = getLogicInterface(value, true);

          return {
            id: cuid(),
            logicInterface: logic,
            ...sanitizeExpression(value, logic),
          };
        }),
      } as LogicGroupData;
    default:
      return { type: ExpressionTypeV2.ADVANCE, value: expressionfyV2(expression) } as ExpressionV2;
  }
};

const expressionV1toV2Adapter = createAdapter<Expression, NodeDataExpressionData>(
  (expression) => {
    const logicInterface = getLogicInterface(expression);

    return {
      id: cuid(),
      type: null,
      value: [
        {
          id: cuid(),
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
