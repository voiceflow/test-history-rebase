import { boolean } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { Variant, createTestableStory } from '@/../.storybook';

import TextArea from '.';

storiesOf('TextArea', module).add(
  'variants',
  createTestableStory(() => {
    const disabled = boolean('disabled', false);
    const [value, setValue] = React.useState(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac orci at neque ultricies venenatis suscipit sed nunc.'
    );

    return (
      <>
        <Variant label="TextArea">
          <div style={{ width: '300px' }}>
            <TextArea disabled={disabled} placeholder="placeholder" value={value} onChange={(e) => setValue(e.target.value)} />
          </div>
        </Variant>
      </>
    );
  })
);
