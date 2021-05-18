import React from 'react';

import * as Diagram from '@/ducks/diagram';
import { connect } from '@/hocs';

import ExpressionForm from './components/ExpressionForm';
import ExpressionPreview from './components/ExpressionPreview';

const SIMPLE_EXPRESSIONS = ['value', 'variable', 'advance'];

export function ExpressionEditor({ expression, ...props }) {
  const showPreview = !SIMPLE_EXPRESSIONS.includes(expression.type);

  return (
    <>
      {showPreview && <ExpressionPreview expression={expression} />}
      <ExpressionForm expression={expression} {...props} />
    </>
  );
}

const mapStateToProps = {
  variables: Diagram.activeDiagramAllVariablesSelector,
};

export default connect(mapStateToProps, null, null, { forwardRef: true })(ExpressionEditor);
