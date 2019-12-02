import React from 'react';

import DefaultInput from './components/DefaultInput';
import InlineInput from './components/InlineInput';

export * from './components/styled';

const INPUT_VARIANTS = {
  default: DefaultInput,
  inline: InlineInput,
};

function Input({ variant, ...props }, ref) {
  const Component = INPUT_VARIANTS[variant] || DefaultInput;

  return <Component {...props} ref={ref} />;
}

export default React.forwardRef(Input);
