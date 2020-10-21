import { Expression, ExpressionType } from '@voiceflow/general-types';
import cuid from 'cuid';

import { createAdapter } from '@/client/adapters/utils';
import { NodeData } from '@/models';

const convertExpressionValueFromDB = (expression: Expression): string | NodeData.Expression | [NodeData.Expression, NodeData.Expression] => {
  switch (expression.type) {
    case ExpressionType.NOT:
      return expressionAdapter.fromDB(expression.value);
    case ExpressionType.OR:
    case ExpressionType.AND:
    case ExpressionType.PLUS:
    case ExpressionType.MINUS:
    case ExpressionType.TIMES:
    case ExpressionType.DIVIDE:
    case ExpressionType.GREATER:
    case ExpressionType.LESS:
    case ExpressionType.EQUALS:
      return expressionAdapter.mapFromDB(expression.value) as [NodeData.Expression, NodeData.Expression];
    default:
      return expression.value;
  }
};

function convertExpressionValueToDB(expression: NodeData.Expression): string | Expression | [Expression, Expression] {
  switch (expression.type) {
    case ExpressionType.NOT:
      return expressionAdapter.toDB(expression.value as NodeData.Expression);
    case ExpressionType.OR:
    case ExpressionType.AND:
    case ExpressionType.PLUS:
    case ExpressionType.MINUS:
    case ExpressionType.TIMES:
    case ExpressionType.DIVIDE:
    case ExpressionType.GREATER:
    case ExpressionType.LESS:
    case ExpressionType.EQUALS:
      return expressionAdapter.mapToDB(expression.value as NodeData.Expression[]) as [Expression, Expression];
    default:
      return expression.value;
  }
}

const expressionAdapter = createAdapter<Expression, NodeData.Expression>(
  (expression) =>
    ({
      id: cuid.slug(),
      type: expression.type,
      value: convertExpressionValueFromDB(expression),
      depth: expression.depth,
    } as NodeData.Expression),
  (expression) =>
    ({
      type: expression.type,
      value: convertExpressionValueToDB(expression),
      depth: expression.depth,
    } as Expression)
);

export default expressionAdapter;
