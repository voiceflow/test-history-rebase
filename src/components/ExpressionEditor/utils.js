import { ExpressionType } from '@/constants';

export const evolveValue = (expression, type) => {
  const originalType = expression.type;
  const depth = expression.depth + 1;
  switch (type) {
    case ExpressionType.ADVANCE:
    case ExpressionType.VALUE:
      return '';
    case ExpressionType.VARIABLE:
      return null;
    case ExpressionType.NOT:
      switch (originalType) {
        case ExpressionType.ADVANCE:
        case ExpressionType.VALUE:
        case ExpressionType.VARIABLE:
          return {
            type: originalType,
            value: expression.value,
            depth,
          };
        default:
          return {
            type: expression.value[0].type,
            value: expression.value[0].value,
            depth,
          };
      }
    default:
      if (Array.isArray(expression.value)) {
        // do nothing since its already 2 type value
      } else if (originalType === ExpressionType.ADVANCE || originalType === ExpressionType.VALUE || originalType === ExpressionType.VARIABLE) {
        return [
          {
            type: originalType,
            value: expression.value,
            depth,
          },
          {
            type: ExpressionType.VALUE,
            value: '',
            depth,
          },
        ];
      } else {
        return [
          {
            type: ExpressionType.VALUE,
            value: '',
            depth,
          },
          {
            type: ExpressionType.VALUE,
            value: '',
            depth,
          },
        ];
      }
  }
};

export const evolveExpression = (expression, type) => {
  const newExpression = {
    ...expression,
  };
  newExpression.type = type;
  newExpression.value =
    evolveValue(expression, type) || (type === ExpressionType.ADVANCE || type === ExpressionType.VALUE || type === ExpressionType.VARIABLE)
      ? evolveValue(expression, type)
      : expression.value;
  return newExpression;
};
