import { boolean, text } from '@storybook/addon-knobs';
import React from 'react';

import TextArea from '.';

const getProps = () => {
  const disabled = boolean('disabled', false);
  const placeholder = text('Placeholder', 'placeholder');
  const [value, setValue] = React.useState(
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac orci at neque ultricies venenatis suscipit sed nunc.'
  );

  return {
    value,
    disabled,
    placeholder,
    onChange: (e) => setValue(e.target.value),
  };
};

export default {
  title: 'Text Area',
  component: TextArea,
  includeStories: [],
};

export const normal = () => (
  <div style={{ width: '300px' }}>
    <TextArea {...getProps()} />
  </div>
);
