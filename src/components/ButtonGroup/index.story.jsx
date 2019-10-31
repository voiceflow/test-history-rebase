import { storiesOf } from '@storybook/react';
import React from 'react';

import { Variant, createTestableStory } from '@/../.storybook';

import ButtonGroup from '.';

const OPTIONS = [
  {
    value: '1',
    label: 'First Option',
  },
  {
    value: '2',
    label: 'Second Option',
  },
  {
    value: '3',
    label: 'Third Option',
  },
];

storiesOf('Button Group', module).add(
  'variants',
  createTestableStory(() => {
    const [selected, updateSelected] = React.useState(OPTIONS[0].value);

    return (
      <Variant>
        <ButtonGroup options={OPTIONS} selected={selected} onChange={(value) => updateSelected(value)} />
      </Variant>
    );
  })
);
