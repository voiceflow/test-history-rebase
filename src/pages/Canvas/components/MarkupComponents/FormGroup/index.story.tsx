import { text } from '@storybook/addon-knobs';
import React from 'react';

import FormGroup from '.';

export default {
  title: 'Creator/Markup Components/Slider Input Group',
  component: FormGroup,
};

const createStory = () => () => (
  <div style={{ maxWidth: '400px', margin: '50px auto' }}>
    <FormGroup leftColumn={text('left column', 'left column')} rightColumn={text('right column', 'right column')} />
  </div>
);

export const normal = createStory();
