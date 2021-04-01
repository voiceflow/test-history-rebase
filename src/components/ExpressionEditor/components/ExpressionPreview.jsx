import { ExpressionType } from '@voiceflow/general-types';
import React from 'react';

import { MAX_DEPTH } from '../constants';
import ExpressionAdvance from './ExpressionAdvance';
import ExpressionDefault from './ExpressionDefault';
import ExpressionNot from './ExpressionNot';
import ExpressionValue from './ExpressionValue';
import ExpressionVariable from './ExpressionVariable';
import PreviewContainer from './PreviewContainer';

const expressionify = (expression, { parentType, maxLineLength, inEditor = false, depth = 0 } = {}) => {
  if (!expression) {
    return <div>err</div>;
  }

  if (depth > MAX_DEPTH) {
    return <span className="math unknown">?</span>;
  }

  switch (expression.type) {
    case ExpressionType.ADVANCE:
      return <ExpressionAdvance depth={depth} value={expression.value} maxLineLength={maxLineLength} isPreview />;
    case ExpressionType.VALUE:
      return <ExpressionValue depth={depth} value={expression.value} isPreview />;
    case ExpressionType.VARIABLE:
      return <ExpressionVariable depth={depth} value={expression.value} maxLineLength={maxLineLength} isPreview inEditor={inEditor} />;
    case ExpressionType.NOT:
      return (
        <ExpressionNot
          type={expression.type}
          depth={depth}
          value={expression.value}
          isPreview
          parentType={parentType}
          maxLineLength={maxLineLength}
          inEditor={inEditor}
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
          maxLineLength={maxLineLength}
          inEditor={inEditor}
          expressionify={expressionify}
        />
      );
  }
};

function ExpressionPreview({ expression, maxLineLength = 24, inEditor = false, container: Container = PreviewContainer, prefix = null, ...props }) {
  if (!expression) return null;

  return (
    <Container className="expressionfy" {...props}>
      {prefix} {expressionify(expression, { maxLineLength, inEditor })}
    </Container>
  );
}

export default ExpressionPreview;
