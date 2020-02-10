import React from 'react';

import { connect } from '@/hocs';
import { allVariablesSelector } from '@/store/selectors';

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
  variables: allVariablesSelector,
};

export default connect(mapStateToProps, null, null, { forwardRef: true })(ExpressionEditor);
