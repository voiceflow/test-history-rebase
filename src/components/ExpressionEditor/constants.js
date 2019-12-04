import { ExpressionType } from '@/constants';

export const GROUPS = [
  [ExpressionType.PLUS, ExpressionType.MINUS, ExpressionType.TIMES, ExpressionType.DIVIDE],
  [ExpressionType.EQUALS, ExpressionType.GREATER, ExpressionType.LESS],
  [ExpressionType.AND, ExpressionType.OR, ExpressionType.NOT],
  [ExpressionType.VALUE, ExpressionType.VARIABLE],
  [ExpressionType.ADVANCE],
];

const SAME_LEVEL = [
  [ExpressionType.PLUS, ExpressionType.MINUS],
  [ExpressionType.TIMES],
  [ExpressionType.DIVIDE],
  [ExpressionType.EQUALS],
  [ExpressionType.GREATER],
  [ExpressionType.LESS],
  [ExpressionType.AND],
  [ExpressionType.OR],
  [ExpressionType.NOT],
];

export const LEVELS = SAME_LEVEL.reduce((acc, level) => {
  level.forEach((type) => {
    acc[type] = new Set(level);
  });

  return acc;
}, {});

export const MAX_DEPTH = 8;

export const ARITHMETIC = GROUPS[0];
