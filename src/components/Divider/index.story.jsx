import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import Variant from '@/../.storybook/Variant';

import Divider from '.';

storiesOf('Divider', module).add('variants', () => {
  const label = text('Label', 'Button');

  return (
    <>
      <Variant label="normal">
        <div style={{ width: 200 }}>
          <Divider />
        </div>
      </Variant>
      <Variant label="labeled">
        <div style={{ width: 200 }}>
          <Divider>{label}</Divider>
        </div>
      </Variant>
    </>
  );
});
