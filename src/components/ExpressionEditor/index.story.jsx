import { storiesOf } from '@storybook/react';
import React from 'react';

import { Variant, createTestableStory } from '@/../.storybook';
import { withRedux } from '@/utils/testing';

import { ExpressionEditor } from '.';

const variables = ['sessions', 'user_id', 'timestamp', 'platform', 'locale'];

storiesOf('ExpressionEditor', module).add(
  'variants',
  createTestableStory(() => {
    const [expression, updateExpression] = React.useState({
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
    });

    return (
      <>
        <Variant label="default">
          <div style={{ width: '300px' }}>
            <ExpressionEditor expression={expression} variables={variables} onChange={updateExpression} />
          </div>
          <hr />
          <pre>{JSON.stringify(expression, null, 2)}</pre>
        </Variant>
      </>
    );
  }, withRedux())
);
