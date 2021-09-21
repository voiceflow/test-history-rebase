import React from 'react';

import { StringifyEnum } from '../../types';
import { DefaultInput, InlineInput } from './components';
import { InlineInputProps } from './components/InlineInput';
import { InputVariant } from './constants';

export * from './components';
export * from './constants';
export * from './styles';

const INPUT_VARIANTS = {
  [InputVariant.DEFAULT]: DefaultInput,
  [InputVariant.INLINE]: InlineInput,
};

export type InputProps = InlineInputProps &
  React.ComponentProps<typeof DefaultInput> & {
    variant?: StringifyEnum<InputVariant>;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  };

const Input: React.ForwardRefRenderFunction<HTMLInputElement, InputProps> = ({ variant = InputVariant.DEFAULT, ...props }, ref) => {
  const Component = INPUT_VARIANTS[variant];

  return variant === InputVariant.INLINE && props.children ? props.children({ ref }) : <Component {...props} ref={ref} />;
};

export default React.forwardRef(Input);
