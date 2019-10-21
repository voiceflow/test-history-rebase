import React from 'react';

import { ExpressionType } from '@/constants';

export const SYMBOLS = {
  [ExpressionType.PLUS]: <i className="fas fa-plus" />,
  [ExpressionType.MINUS]: <i className="fas fa-minus" />,
  [ExpressionType.TIMES]: <i className="fas fa-times" />,
  [ExpressionType.DIVIDE]: <i className="fas fa-divide" />,
  [ExpressionType.EQUALS]: <i className="fas fa-equals" />,
  [ExpressionType.GREATER]: <i className="fas fa-greater-than" />,
  [ExpressionType.LESS]: <i className="fas fa-less-than" />,
  [ExpressionType.AND]: 'AND',
  [ExpressionType.OR]: 'OR',
  [ExpressionType.NOT]: 'NOT',
  [ExpressionType.VALUE]: 'Value',
  [ExpressionType.VARIABLE]: 'Variable',
  [ExpressionType.ADVANCE]: 'Expression',
};

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

export const ARITHMETIC = GROUPS[0];
