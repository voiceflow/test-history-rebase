import cuid from 'cuid';

import { textEditorContentAdapter } from '@/client/adapters/textEditor';
import { ExpressionType } from '@/constants';

import { createAdapter } from './utils';

const expressionAdapter = createAdapter(
  ({ type, value, depth }) => ({
    id: cuid.slug(),
    type,
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    value: convertExpressionValueFromDB(type, value),
    depth,
  }),
  ({ type, value, depth }) => ({
    type,
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    value: convertExpressionValueToDB(type, value),
    depth,
  })
);

export default expressionAdapter;

function convertExpressionValueFromDB(type, value) {
  switch (type) {
    case ExpressionType.ADVANCE:
      return typeof value === 'object' ? textEditorContentAdapter.fromDB(value) : value;
    case ExpressionType.VARIABLE:
      return value?.value ?? value;
    case ExpressionType.NOT:
      return expressionAdapter.fromDB(value);
    case ExpressionType.OR:
    case ExpressionType.AND:
    case ExpressionType.PLUS:
    case ExpressionType.MINUS:
    case ExpressionType.TIMES:
    case ExpressionType.DIVIDE:
    case ExpressionType.GREATER:
    case ExpressionType.LESS:
    case ExpressionType.EQUALS:
      return expressionAdapter.mapFromDB(value);
    default:
      return value;
  }
}

function convertExpressionValueToDB(type, value) {
  switch (type) {
    case ExpressionType.ADVANCE:
      return textEditorContentAdapter.toDB(value);
    case ExpressionType.NOT:
      return expressionAdapter.toDB(value);
    case ExpressionType.OR:
    case ExpressionType.AND:
    case ExpressionType.PLUS:
    case ExpressionType.MINUS:
    case ExpressionType.TIMES:
    case ExpressionType.DIVIDE:
    case ExpressionType.GREATER:
    case ExpressionType.LESS:
    case ExpressionType.EQUALS:
      return expressionAdapter.mapToDB(value);
    default:
      return value;
  }
}
