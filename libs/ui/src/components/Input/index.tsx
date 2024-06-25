import composeRefs from '@seznam/compose-react-refs';
import { useSetup } from '@ui/hooks';
import type { Either } from '@ui/types';
import { withEnterPress, withTargetValue } from '@ui/utils/dom';
import { Utils } from '@voiceflow/common';
import React from 'react';

import type { DefaultInputProps, InlineInputProps } from './components';
import {
  CounterInput,
  DefaultInput,
  InlineInput,
  InputWrapper,
  RangeInput,
  ScrollingPlaceholderWrapper,
} from './components';
import { inputFocusStyle } from './styles';
import { Variant } from './types';

export * from './components';
export * from './styles';
export * as InputTypes from './types';

/**
 * @deprecated
 */
export { Variant as InputVariant, NestedIconPosition as NestedInputIconPosition } from './types';

interface SharedProps {
  onChangeText?: (value: string) => void;
  onEnterPress?: React.KeyboardEventHandler<HTMLInputElement>;
  autoSelectText?: boolean;
}

export interface InlineVariantInputProps
  extends InlineInputProps,
    SharedProps,
    Omit<React.ComponentProps<'input'>, 'ref' | 'children'> {
  variant: Variant.INLINE;
  children?: DefaultInputProps['children'];
}

interface BaseDefaultVariantInputProps extends SharedProps {
  variant?: Variant.DEFAULT;
}

export type DefaultVariantInputProps = BaseDefaultVariantInputProps & DefaultInputProps;

const Input = React.forwardRef<HTMLInputElement, Either<InlineVariantInputProps, DefaultVariantInputProps>>(
  (
    { variant = Variant.DEFAULT, onChange, children, autoSelectText, onKeyPress, onChangeText, onEnterPress, ...props },
    ref
  ) => {
    const localRef = React.useRef<HTMLInputElement>(null);

    useSetup(() => {
      if (autoSelectText) {
        localRef?.current?.select();
      }
    });

    const sharedProps = {
      ...props,
      ref: composeRefs<HTMLInputElement>(ref, localRef),
      onChange: Utils.functional.chain<[React.ChangeEvent<HTMLInputElement>]>(
        onChange,
        onChangeText && withTargetValue(onChangeText)
      ),
      onKeyPress: Utils.functional.chain<[React.KeyboardEvent<HTMLInputElement>]>(
        onKeyPress,
        onEnterPress && withEnterPress(onEnterPress)
      ),
    };

    if (variant === Variant.INLINE) {
      return children ? children({ ref }) : <InlineInput {...sharedProps} />;
    }

    return <DefaultInput {...sharedProps}>{children}</DefaultInput>;
  }
);

export default Object.assign(Input, {
  Variant,

  Range: RangeInput,
  Counter: CounterInput,
  Container: InputWrapper,
  ScrollingPlaceholder: ScrollingPlaceholderWrapper,

  focusStyle: inputFocusStyle,
});
