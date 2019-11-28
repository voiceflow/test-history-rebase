import React from 'react';

import { ExpressionType } from '@/constants';

import { MAX_DEPTH } from '../constants';
import ExpressionAdvance from './ExpressionAdvance';
import ExpressionDefault from './ExpressionDefault';
import ExpressionNot from './ExpressionNot';
import ExpressionValue from './ExpressionValue';
import ExpressionVariable from './ExpressionVariable';
import PreviewContainer from './PreviewContainer';

const expressionify = (expression, depth = 0) => {
  if (!expression) {
    return <div>err</div>;
  }

  if (depth > MAX_DEPTH) {
    return <span className="math unknown">?</span>;
  }

  switch (expression.type) {
    case ExpressionType.ADVANCE:
      return <ExpressionAdvance value={expression.value} isPreview />;
    case ExpressionType.VALUE:
      return <ExpressionValue value={expression.value} isPreview />;
    case ExpressionType.VARIABLE:
      return <ExpressionVariable value={expression.value} isPreview />;
    case ExpressionType.NOT:
      return <ExpressionNot value={expression.value} expressionify={expressionify} isPreview />;
    default:
      return <ExpressionDefault type={expression.type} value={expression.value} expressionify={expressionify} isPreview />;
  }
};

function ExpressionPreview({ expression }) {
  if (!expression) return null;

  return <PreviewContainer className="expressionfy">{expressionify(expression)}</PreviewContainer>;
}

export default ExpressionPreview;
