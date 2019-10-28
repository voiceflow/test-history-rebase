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
        <Variant type="checkbox" label="Checkbox">
          <Checkbox checked={checked} onChange={() => setChecked(!checked)}>
            <span>checkbox</span>
          </Checkbox>
        </Variant>

        <Variant type="radio" label="Radio button">
          <Checkbox checked={checked} onChange={() => setChecked(!checked)}>
            <span>Radio button</span>
          </Checkbox>
        </Variant>
      </>
    );
  })
);
