import React from 'react';

import { withRedux } from '@/utils/testing';

import { ExpressionEditor } from '.';

const INITIAL_VALUE = {
  type: 'equals',
  depth: 0,
  value: [
    {
      type: 'variable',
      value: 'timestamp',
      depth: 1,
    },
    {
      type: 'value',
      value: 'asdasdas',
      depth: 1,
    },
  ],
};
const VARIABLES = ['sessions', 'user_id', 'timestamp', 'platform', 'locale'];

export default {
  title: 'Expression Editor',
  component: ExpressionEditor,
};

export const normal = withRedux()(() => {
  const [expression, updateExpression] = React.useState(INITIAL_VALUE);

  return (
    <>
      <div style={{ width: '300px' }}>
        <ExpressionEditor expression={expression} variables={VARIABLES} onChange={updateExpression} />
      </div>
      <hr />
      <pre>{JSON.stringify(expression, null, 2)}</pre>
    </>
  );
});
