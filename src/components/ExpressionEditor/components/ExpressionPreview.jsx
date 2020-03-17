import React from 'react';

import { ExpressionType } from '@/constants';

import { MAX_DEPTH } from '../constants';
import ExpressionAdvance from './ExpressionAdvance';
import ExpressionDefault from './ExpressionDefault';
import ExpressionNot from './ExpressionNot';
import ExpressionValue from './ExpressionValue';
import ExpressionVariable from './ExpressionVariable';
import PreviewContainer from './PreviewContainer';

const expressionify = (expression, { parentType, depth = 0 } = {}) => {
  if (!expression) {
    return <div>err</div>;
  }

  if (depth > MAX_DEPTH) {
    return <span className="math unknown">?</span>;
  }

  switch (expression.type) {
    case ExpressionType.ADVANCE:
      return <ExpressionAdvance depth={depth} value={expression.value} isPreview />;
    case ExpressionType.VALUE:
      return <ExpressionValue depth={depth} value={expression.value} isPreview />;
    case ExpressionType.VARIABLE:
      return <ExpressionVariable depth={depth} value={expression.value} isPreview />;
    case ExpressionType.NOT:
      return (
        <ExpressionNot
          type={expression.type}
          depth={depth}
          value={expression.value}
          isPreview
          parentType={parentType}
          expressionify={expressionify}
        />
      );
    default:
      return (
        <ExpressionDefault
          type={expression.type}
          depth={depth}
          value={expression.value || ''}
          isPreview
          parentType={parentType}
          expressionify={expressionify}
        />
      );
  }
};

function ExpressionPreview({ expression, container: Container = PreviewContainer, prefix = null, ...props }) {
  if (!expression) return null;

  return (
    <Container className="expressionfy" {...props}>
      {prefix} {expressionify(expression)}
    </Container>
  );
}

export default ExpressionPreview;
