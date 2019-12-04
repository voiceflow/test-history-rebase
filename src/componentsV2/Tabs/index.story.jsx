import { action } from '@storybook/addon-actions';
import { select } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { Variant, createTestableStory } from '@/../.storybook';

import Tabs from '.';

const options = [
  { value: '1', label: 'First value' },
  { value: '2', label: 'second value' },
  { value: '3', label: 'third long long long long value' },
];

storiesOf('Tabs', module).add(
  'variants',
  createTestableStory(() => {
    const [selected, updateSelected] = React.useState();
    const knobSelected = select('selected', options.map(({ value }) => value), options[0].value);

    return (
      <>
        <Variant label="default">
          <div style={{ height: 50 }}>
            <Tabs options={options} selected={selected} onChange={(value) => updateSelected(value)} />
          </div>
        </Variant>

        <Variant label="props control">
          <div style={{ height: 50 }}>
            <Tabs options={options} selected={knobSelected} onChange={action('onChange')} />
          </div>
        </Variant>
      </>
    );
  })
);
