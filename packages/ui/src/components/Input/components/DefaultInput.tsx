import { NestedInputIconPosition } from '@ui/components/Input/constants';
import { inputStyle, StyledInputProps } from '@ui/components/Input/styles';
import SvgIcon, { Icon, SvgIconProps } from '@ui/components/SvgIcon';
import { useCombinedRefs } from '@ui/hooks';
import { styled } from '@ui/styles';
import { Either } from '@ui/types';
import React from 'react';

import ChildInput from './ChildInput';
import InlineInput from './InlineInput';
import InputWrapper, { InputWrapperProps } from './InputWrapper';

const PlainInput = styled.input<StyledInputProps>`
  ${inputStyle}
`;

PlainInput.displayName = 'Input';

export type NestedInputProps = Omit<React.ComponentProps<'input'>, 'ref'> & {
  className?: string;
  icon?: Icon | React.ComponentType;
  error?: boolean;
  disabled?: boolean;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  hasAction?: boolean;
  iconProps?: Partial<SvgIconProps>;
  iconPosition?: NestedInputIconPosition;
  wrapperProps?: InputWrapperProps;
  children?: (props: { ref: React.Ref<HTMLInputElement> }) => React.ReactElement;
  onCustomFocus?: () => void;
};

export const NestedInput = React.forwardRef<HTMLInputElement, NestedInputProps>(
  (
    {
      icon,
      error,
      iconProps,
      wrapperProps,
      disabled,
      children,
      leftAction,
      rightAction,
      className,
      iconPosition = NestedInputIconPosition.LEFT,
      onCustomFocus,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const combinedRef = useCombinedRefs<HTMLInputElement>(ref, inputRef);

    const onClick = () => {
      inputRef.current?.focus?.();
      onCustomFocus?.();
    };

    const iconComponent = typeof icon === 'string' && <SvgIcon icon={icon} {...iconProps} />;

    return (
      <InputWrapper onClick={onClick} disabled={disabled} {...wrapperProps} error={error} className={className}>
        {leftAction}
        {iconPosition === NestedInputIconPosition.LEFT && iconComponent}
        <ChildInput>{children ? children({ ref: combinedRef }) : <InlineInput {...props} ref={combinedRef} disabled={disabled} />}</ChildInput>
        {iconPosition === NestedInputIconPosition.RIGHT && iconComponent}
        {rightAction}
      </InputWrapper>
    );
  }
);

export interface InputProps {
  nested?: boolean;
  children?: NestedInputProps['children'];
}

const Input = React.forwardRef<HTMLInputElement, InputProps & Either<NestedInputProps, React.ComponentProps<'input'> & StyledInputProps>>(
  ({ nested, ...props }, ref) => {
    if (props.icon || props.children || props.leftAction || props.rightAction || nested || props.hasAction) {
      return <NestedInput {...props} ref={ref} />;
    }

    return <PlainInput {...props} ref={ref} />;
  }
);

export default Input;
