import React from 'react';

const symbols = {
  plus: <i className="fas fa-plus" />,
  minus: <i className="fas fa-minus" />,
  times: <i className="fas fa-times" />,
  divide: <i className="fas fa-divide" />,
  equals: <i className="fas fa-equals" />,
  greater: <i className="fas fa-greater-than" />,
  less: <i className="fas fa-less-than" />,
  and: 'AND',
  or: 'OR',
  not: 'NOT',
  value: 'Value',
  variable: 'Variable',
  advance: 'Expression',
};

const groups = [['plus', 'minus', 'times', 'divide'], ['equals', 'greater', 'less'], ['and', 'or', 'not'], ['value', 'variable'], ['advance']];

const sameLevel = [['plus', 'minus'], ['times'], ['divide'], ['equals'], ['greater'], ['less'], ['and'], ['or'], ['not']];

const levels = {};

sameLevel.forEach((level) => {
  level.forEach((type) => {
    levels[type] = new Set(level);
  });
});

const arithmetic = groups[1];

export { symbols, groups, arithmetic, levels };
