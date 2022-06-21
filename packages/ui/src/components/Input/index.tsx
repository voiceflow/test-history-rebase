import composeRefs from '@seznam/compose-react-refs';
import { useSetup } from '@ui/hooks';
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
  autoSelectText?: boolean;
}

export interface InlineVariantInputProps extends InlineInputProps, SharedProps, Omit<React.ComponentProps<'input'>, 'ref' | 'children'> {
  variant: InputVariant.INLINE;
  children?: DefaultInputProps['children'];
}

interface BaseDefaultVariantInputProps extends SharedProps {
  variant?: InputVariant.DEFAULT;
}

export type DefaultVariantInputProps = BaseDefaultVariantInputProps & DefaultInputProps;

const Input = React.forwardRef<HTMLInputElement, Either<InlineVariantInputProps, DefaultVariantInputProps>>(
  ({ variant = InputVariant.DEFAULT, onChange, autoSelectText, onKeyPress, onChangeText, onEnterPress, ...props }, ref) => {
    const Component = INPUT_VARIANTS[variant];
    const localRef = React.useRef<HTMLInputElement>(null);

    useSetup(() => {
      if (autoSelectText) {
        localRef?.current?.select();
      }
    });

    return variant === InputVariant.INLINE && props.children ? (
      props.children({ ref })
    ) : (
      <Component
        {...props}
        ref={composeRefs(ref, localRef)}
        onChange={Utils.functional.chain(onChange, onChangeText && withTargetValue(onChangeText))}
        onKeyPress={Utils.functional.chain(onKeyPress, onEnterPress && withEnterPress(onEnterPress))}
      />
    );
  }
);

export default Object.assign(Input, {
  Variant: InputVariant,
});
