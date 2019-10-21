import React from 'react';

import { ExpressionType } from '@/constants';

import { ARITHMETIC, SYMBOLS } from '../constants';
import Container from './ExpressionPreviewContainer';

const MAX_DEPTH = 8;
const BLANK_SPACE_PATTERN = /^\s+$/;
const DOUBLE_QUOTE_PATTERN = /"/g;

const expressionfy = (expression, depth = 0) => {
  if (!expression) {
    return <div>err</div>;
  }

  if (depth > MAX_DEPTH) {
    // return a blank
    return <span className="math unknown">?</span>;
  }

  if (expression.type === ExpressionType.ADVANCE) {
    if (typeof expression.value !== 'object' || expression.value[0] === '') return <span className="math unknown">?</span>;

    return (
      <span className="math brackets">
        {expression.value.map((valuePart, index) =>
          typeof valuePart === 'object' ? (
            <span className="math variable" key={index}>
              {`{${valuePart.name}}`}
            </span>
          ) : (
            valuePart
              .split('\n')
              .filter((line) => line && !BLANK_SPACE_PATTERN.test(line))
              .join(', ')
          )
        )}
      </span>
    );
  }

  if (expression.type === ExpressionType.VALUE) {
    const value = expression.value.toString();

    if (!expression.value) {
      return <span className="math unknown">?</span>;
    }

    // eslint-disable-next-line no-restricted-globals
    if (isNaN(value)) {
      return <span className="value">{value.replace(DOUBLE_QUOTE_PATTERN, "'")}</span>;
    }

    return <span className="math value">{parseInt(value, 10)}</span>;
  }

  if (expression.type === ExpressionType.VARIABLE) {
    if (expression.value) {
      return <span className="math variable">{`{${expression.value}}`}</span>;
    }

    return <span className="math unknown">?</span>;
  }

  if (expression.type === ExpressionType.NOT) {
    return (
      <span className="brackets">
        ( <span className="not">NOT</span> {expressionfy(expression.value)} )
      </span>
    );
  }

  if (ARITHMETIC.includes(expression.type)) {
    let first = expressionfy(expression.value[0]);
    if (first.props.className && !first.props.className.startsWith('math')) {
      first = <span className="NaN" />;
    }

    let second = expressionfy(expression.value[1]);
    if (second.props.className && !second.props.className.startsWith('math')) {
      second = <span className="NaN" />;
    }

    return (
      <span className="math brackets">
        ( {first} {SYMBOLS[expression.type]} {second} )
      </span>
    );
  }

  if (expression.type) {
    return (
      <span className="brackets">
        ( {expressionfy(expression.value[0])} <span className={expression.type}>{SYMBOLS[expression.type]}</span> {expressionfy(expression.value[1])}{' '}
        )
      </span>
    );
  }

  return null;
};

function ExpressionPreview({ expression }) {
  if (!expression) return null;

  return <Container className="expressionfy">{expressionfy(expression)}</Container>;
}

export default ExpressionPreview;
