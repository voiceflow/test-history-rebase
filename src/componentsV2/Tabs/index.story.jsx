import { storiesOf } from '@storybook/react';
import React from 'react';

import { Variant, createTestableStory } from '@/../.storybook';

import Tabs from '.';

storiesOf('Tabs', module).add(
  'variants',
  createTestableStory(() => {
    const [selected, updateSelected] = React.useState(-1);

    return (
      <Variant label="default">
        <div style={{ height: 50 }}>
          <Tabs
            options={[{ value: 'abc', label: 'ABC' }, { value: 'def', label: 'DEF' }]}
            selected={selected}
            onChange={(value) => updateSelected(value)}
          />
        </div>
      </Variant>
    );
  })
);
