import { storiesOf } from '@storybook/react';
import React from 'react';

import { Variant, createTestableStory } from '@/../.storybook';

import Checkbox from './index';

storiesOf('Checkbox', module).add(
  'variants',
  createTestableStory(() => {
    const [checked, setChecked] = React.useState(false);

    return (
      <>
        <Variant label="Checkbox">
          <Checkbox type="checkbox" checked={checked} onChange={() => setChecked(!checked)}>
            <span>checkbox</span>
          </Checkbox>
        </Variant>

        <Variant label="Radio button">
          <Checkbox type="radio" checked={checked} onChange={() => setChecked(!checked)}>
            <span>Radio button</span>
          </Checkbox>
        </Variant>
      </>
    );
  })
);
