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

import { createAdapter } from '@/client/adapters/utils';
import { Expression as NodeDataExpression, ExpressionData as NodeDataExpressionData } from '@/models';
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
          type: (expression.type as unknown) as ExpressionTypeV2,
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
          type: (expression.type as unknown) as ExpressionTypeV2,
          value: expression.value.map((data: any) => {
            const isVariable = data.type === ExpressionType.VARIABLE;

            return { type: data.type, value: isVariable ? `{{[${data.value}].${data.value}}}` : data.value };
          }),
        } as ExpressionV2;
      }
      return { type: ExpressionTypeV2.ADVANCE, value: expression.value } as ExpressionV2;
    case ConditionsLogicInterface.LOGIC_GROUP:
      return {
        type: (expression.type as unknown) as ExpressionTypeV2,
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

const expressionAdapter = createAdapter<Expression, NodeDataExpressionData>(
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
    throw new Error("shouldn't be called");
  }
);

export default expressionAdapter;

/** @deprecated */

const convertExpressionValueFromDB = (expression: Expression): string | NodeDataExpression | [NodeDataExpression, NodeDataExpression] => {
  switch (expression.type) {
    case ExpressionType.NOT:
      return expressionAdapterLegacy.fromDB(expression.value);
    case ExpressionType.OR:
    case ExpressionType.AND:
    case ExpressionType.PLUS:
    case ExpressionType.MINUS:
    case ExpressionType.TIMES:
    case ExpressionType.DIVIDE:
    case ExpressionType.GREATER:
    case ExpressionType.LESS:
    case ExpressionType.EQUALS:
      return expressionAdapterLegacy.mapFromDB(expression.value) as [NodeDataExpression, NodeDataExpression];
    default:
      return expression.value;
  }
};

/** @deprecated */

function convertExpressionValueToDB(expression: NodeDataExpression): string | Expression | [Expression, Expression] {
  switch (expression.type) {
    case ExpressionType.NOT:
      return expressionAdapterLegacy.toDB(expression.value as NodeDataExpression);
    case ExpressionType.OR:
    case ExpressionType.AND:
    case ExpressionType.PLUS:
    case ExpressionType.MINUS:
    case ExpressionType.TIMES:
    case ExpressionType.DIVIDE:
    case ExpressionType.GREATER:
    case ExpressionType.LESS:
    case ExpressionType.EQUALS:
      return expressionAdapterLegacy.mapToDB(expression.value as NodeDataExpression[]) as [Expression, Expression];
    default:
      return expression.value;
  }
}

/** @deprecated */

export const expressionAdapterLegacy = createAdapter<Expression, NodeDataExpression>(
  (expression) =>
    ({
      id: cuid.slug(),
      type: expression.type,
      value: convertExpressionValueFromDB(expression),
      depth: expression.depth,
    } as NodeDataExpression),
  (expression) =>
    ({
      type: expression.type,
      value: convertExpressionValueToDB(expression),
      depth: expression.depth,
    } as Expression)
);
