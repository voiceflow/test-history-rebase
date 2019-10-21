import React from 'react';

import DefaultInput from './components/DefaultInput';
import InlineInput from './components/InlineInput';

export * from './components/styled';

const INPUT_VARIANTS = {
  default: DefaultInput,
  inline: InlineInput,
};

function Input({ variant, ...props }) {
  const Component = INPUT_VARIANTS[variant] || DefaultInput;

  return <Component {...props} />;
}

export default Input;
