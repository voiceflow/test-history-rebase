import { button, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { Variant, createTestableStory } from '@/../.storybook';

import { ToastContainer, toast } from '.';

storiesOf('Toast', module).add(
  'variants',
  createTestableStory(() => {
    const ref = React.useRef();

    ref.current = text('message', 'Toast message!');

    button('default', () => toast(ref.current));
    button('info', () => toast.info(ref.current));
    button('success', () => toast.success(ref.current));
    button('warning', () => toast.warning(ref.current));
    button('error', () => toast.error(ref.current));

    return (
      <>
        <Variant label="default">
          <ToastContainer />
        </Variant>
      </>
    );
  })
);
