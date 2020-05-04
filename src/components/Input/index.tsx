import React from 'react';

import { ControlledInput, DefaultInput, InlineInput } from './components';
import { InputVariant } from './constants';

export * from './constants';
export { ControlledInput };

const INPUT_VARIANTS = {
  [InputVariant.DEFAULT]: DefaultInput,
  [InputVariant.INLINE]: InlineInput,
};

export type InputProps = {
  variant?: InputVariant;
};

const Input: React.FC<InputProps & React.ComponentProps<typeof DefaultInput>> = ({ variant = InputVariant.DEFAULT, ...props }, ref) => {
  const Component = INPUT_VARIANTS[variant];

  return variant === InputVariant.INLINE && props.children ? props.children({ ref }) : <Component {...props} ref={ref} />;
};

export default React.forwardRef(Input);
