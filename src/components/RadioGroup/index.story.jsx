import { storiesOf } from '@storybook/react';
import React from 'react';

import { Variant, createTestableStory } from '@/../.storybook';

import RadioGroup from './index';

const MultipleOptions = [
  {
    id: 1,
    label: 'Option 1',
  },
  {
    id: 2,
    label: 'Option 2',
  },
  {
    id: 3,
    label: 'Option 3',
  },
];

storiesOf('Radio Group', module).add(
  'variants',
  createTestableStory(() => {
    const [yesNoChecked, setYesNo] = React.useState(false);
    const [multipleChecked, setMultiple] = React.useState(1);

    return (
      <>
        <Variant label="Yes No Radio Button">
          <RadioGroup name="yesNo" checked={yesNoChecked} onChange={() => setYesNo(!yesNoChecked)} />
        </Variant>

        <Variant label="Multiple Radio Button">
          <RadioGroup options={MultipleOptions} name="multiple" checked={multipleChecked} onChange={(value) => setMultiple(value)} />
        </Variant>
      </>
    );
  })
);
