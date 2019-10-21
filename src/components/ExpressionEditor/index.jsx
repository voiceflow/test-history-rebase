import React from 'react';

import ExpressionForm from './components/ExpressionForm';
import ExpressionPreview from './components/ExpressionPreview';

const SIMPLE_EXPRESSIONS = ['value', 'variable', 'advance'];

const ExpressionEditor = ({ expression, ...props }) => {
  const showPreview = !SIMPLE_EXPRESSIONS.includes(expression.type);

  return (
    <>
      {showPreview && <ExpressionPreview expression={expression} />}
      <ExpressionForm expression={expression} {...props} />
    </>
  );
};

export default ExpressionEditor;
