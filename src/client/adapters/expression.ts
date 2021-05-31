import { Expression, ExpressionType } from '@voiceflow/general-types';
import cuid from 'cuid';

import { createAdapter } from '@/client/adapters/utils';
import { Expression as NodeDataExpression } from '@/models';

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
