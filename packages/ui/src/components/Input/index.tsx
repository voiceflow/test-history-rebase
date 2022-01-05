import { Either } from '@ui/types';
import { withEnterPress, withTargetValue } from '@ui/utils/dom';
import { Utils } from '@voiceflow/common';
import React from 'react';

import { DefaultInput, DefaultInputProps, InlineInput, InlineInputProps } from './components';
import { InputVariant } from './constants';

export * from './components';
export * from './constants';
export * from './styles';

const INPUT_VARIANTS = {
  [InputVariant.INLINE]: InlineInput,
  [InputVariant.DEFAULT]: DefaultInput,
};

interface SharedProps {
  onChangeText?: (value: string) => void;
  onEnterPress?: React.KeyboardEventHandler<HTMLInputElement>;
}

export interface InlineVariantInputProps extends InlineInputProps, SharedProps, Omit<React.ComponentProps<'input'>, 'ref' | 'children'> {
  variant: InputVariant.INLINE;
  children?: DefaultInputProps['children'];
}

interface BaseDefaultVariantInputProps extends SharedProps {
  variant?: InputVariant.DEFAULT;
}

export type DefaultVariantInputProps = BaseDefaultVariantInputProps & DefaultInputProps;

const Input: React.ForwardRefRenderFunction<HTMLInputElement, Either<InlineVariantInputProps, DefaultVariantInputProps>> = (
  { variant = InputVariant.DEFAULT, onChange, onKeyPress, onChangeText, onEnterPress, ...props },
  ref
) => {
  const Component = INPUT_VARIANTS[variant];

  return variant === InputVariant.INLINE && props.children ? (
    props.children({ ref })
  ) : (
    <Component
      {...props}
      ref={ref}
      onChange={Utils.functional.chain(onChange, onChangeText && withTargetValue(onChangeText))}
      onKeyPress={Utils.functional.chain(onKeyPress, onEnterPress && withEnterPress(onEnterPress))}
    />
  );
};

export default React.forwardRef(Input);
