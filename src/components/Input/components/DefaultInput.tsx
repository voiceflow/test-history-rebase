import _isString from 'lodash/isString';
import React from 'react';

import SvgIcon, { Icon, SvgIconProps } from '@/components/SvgIcon';
import { styled } from '@/hocs';
import { useCombinedRefs } from '@/hooks/ref';
import { Either } from '@/types';

import { inputStyle, StyledInputProps } from '../styles';
import ChildInput from './ChildInput';
import InlineInput from './InlineInput';
import InputWrapper, { InputWrapperProps } from './InputWrapper';

const PlainInput = styled.input<StyledInputProps>`
  ${inputStyle}
`;

PlainInput.displayName = 'Input';

export enum NestedInputIconPosition {
  LEFT = 'left',
  RIGHT = 'right',
  NONE = 'none',
}

export type NestedInputProps = Omit<React.ComponentProps<'input'>, 'ref'> & {
  className?: string;
  icon?: Icon | React.ComponentType;
  error?: boolean;
  disabled?: boolean;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  iconProps?: Partial<SvgIconProps>;
  iconPosition?: NestedInputIconPosition;
  wrapperProps?: InputWrapperProps;
  children?: (props: { ref: React.Ref<HTMLInputElement> }) => React.ReactElement;
  onCustomFocus?: () => void;
};

// eslint-disable-next-line react/display-name
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

    const iconComponent = _isString(icon) && <SvgIcon icon={icon} {...iconProps} />;

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

export type InputProps = {
  nested?: boolean;
  children?: NestedInputProps['children'];
};

// eslint-disable-next-line react/display-name
const Input = React.forwardRef<HTMLInputElement, InputProps & Either<NestedInputProps, React.ComponentProps<'input'> & StyledInputProps>>(
  ({ nested, ...props }, ref) => {
    if (props.icon || props.children || props.leftAction || props.rightAction || nested) {
      return <NestedInput {...props} ref={ref} />;
    }

    return <PlainInput {...props} ref={ref} />;
  }
);

export default Input;
