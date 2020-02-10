import React from 'react';

import { ControlledInput, DefaultInput, InlineInput } from './components';

export { ControlledInput };

const INPUT_VARIANTS = {
  default: DefaultInput,
  inline: InlineInput,
};

function Input({ variant = 'default', ...props }, ref) {
  const Component = INPUT_VARIANTS[variant];

  return variant === 'inline' && props.children ? props.children({ ref }) : <Component {...props} ref={ref} />;
}

export default React.forwardRef(Input);
