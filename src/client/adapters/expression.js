import cuid from 'cuid';

import { ExpressionType } from '@/constants';

import { draftJSContentAdapter } from './draft';
import { createAdapter } from './utils';

const expressionAdapter = createAdapter(
  ({ type, value, depth }) => {
    if (!value || typeof value !== 'object') {
      return { type, value, depth };
    }

    return {
      id: cuid.slug(),
      type,
      value: convertExpressionValueFromDB(type, value),
      depth,
    };
  },
  ({ type, value, depth }) => {
    if (!value || typeof value !== 'object') {
      return { type, value, depth };
    }

    return {
      type,
      value: convertExpressionValueToDB(type, value),
      depth,
    };
  }
);

export default expressionAdapter;

function convertExpressionValueFromDB(type, value) {
  switch (type) {
    case ExpressionType.ADVANCE:
      return draftJSContentAdapter.fromDB(value);
    case ExpressionType.VARIABLE:
      return value.value;
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
      return draftJSContentAdapter.toDB(value);
    case ExpressionType.VARIABLE:
      return { value };
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
