import composeRefs from '@seznam/compose-react-refs';
import { useSetup } from '@ui/hooks';
import { Either } from '@ui/types';
import { withEnterPress, withTargetValue } from '@ui/utils/dom';
import { Utils } from '@voiceflow/common';
import React from 'react';

import { CounterInput, DefaultInput, DefaultInputProps, InlineInput, InlineInputProps, InputWrapper } from './components';
import { inputFocusStyle } from './styles';
import { Variant } from './types';

export * from './components';
export * from './styles';
export * as InputTypes from './types';

/**
 * @deprecated
 */
export { Variant as InputVariant, NestedIconPosition as NestedInputIconPosition } from './types';

const INPUT_VARIANTS = {
  [Variant.INLINE]: InlineInput,
  [Variant.DEFAULT]: DefaultInput,
};

interface SharedProps {
  onChangeText?: (value: string) => void;
  onEnterPress?: React.KeyboardEventHandler<HTMLInputElement>;
  autoSelectText?: boolean;
}

export interface InlineVariantInputProps extends InlineInputProps, SharedProps, Omit<React.ComponentProps<'input'>, 'ref' | 'children'> {
  variant: Variant.INLINE;
  children?: DefaultInputProps['children'];
}

interface BaseDefaultVariantInputProps extends SharedProps {
  variant?: Variant.DEFAULT;
}

export type DefaultVariantInputProps = BaseDefaultVariantInputProps & DefaultInputProps;

const Input = React.forwardRef<HTMLInputElement, Either<InlineVariantInputProps, DefaultVariantInputProps>>(
  ({ variant = Variant.DEFAULT, onChange, autoSelectText, onKeyPress, onChangeText, onEnterPress, ...props }, ref) => {
    const Component = INPUT_VARIANTS[variant];
    const localRef = React.useRef<HTMLInputElement>(null);

    useSetup(() => {
      if (autoSelectText) {
        localRef?.current?.select();
      }
    });

    return variant === Variant.INLINE && props.children ? (
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
  Variant,

  Counter: CounterInput,
  Container: InputWrapper,

  focusStyle: inputFocusStyle,
});
