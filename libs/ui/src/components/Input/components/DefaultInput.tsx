import composeRef from '@seznam/compose-react-refs';
import type { SvgIconTypes } from '@ui/components/SvgIcon';
import SvgIcon from '@ui/components/SvgIcon';
import { css, styled } from '@ui/styles';
import { fontResetStyle } from '@ui/styles/bootstrap';
import type { Either } from '@ui/types';
import React from 'react';

import type { StyledInputProps } from '../styles';
import { hideNumberArrows, inputStyle } from '../styles';
import { NestedIconPosition } from '../types';
import ChildInput from './ChildInput';
import type { InlineInputProps } from './InlineInput';
import InlineInput from './InlineInput';
import type { InputWrapperProps } from './InputWrapper';
import InputWrapper from './InputWrapper';

export interface PlainInputProps extends StyledInputProps, Omit<React.ComponentProps<'input'>, 'ref' | 'children'> {}

const PlainInput = styled.input<StyledInputProps>`
  ${fontResetStyle};
  ${inputStyle};

  ${({ hideDefaultNumberControls }) =>
    hideDefaultNumberControls &&
    css`
      ${hideNumberArrows}
    `}
`;

PlainInput.displayName = 'Input';

export interface NestedInputProps extends PlainInputProps, InlineInputProps {
  icon?: SvgIconTypes.Icon | React.ComponentType;
  error?: boolean;
  nested?: boolean;
  children?: (props: { ref: React.Ref<HTMLInputElement> }) => React.ReactElement;
  disabled?: boolean;
  className?: string;
  iconProps?: Partial<Omit<SvgIconTypes.Props, 'icon'>>;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  iconPosition?: NestedIconPosition;
  wrapperProps?: InputWrapperProps;
  onFocusOnClick?: () => void;
}

export const NestedInput = React.forwardRef<HTMLInputElement, NestedInputProps>(
  (
    {
      icon,
      error,
      isActive,
      readOnly,
      disabled,
      children,
      className,
      iconProps,
      leftAction,
      rightAction,
      iconPosition = NestedIconPosition.LEFT,
      wrapperProps,
      onFocusOnClick,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const combinedRefs = composeRef(ref, inputRef);

    const onClick = () => {
      inputRef.current?.focus?.();
      onFocusOnClick?.();
    };

    const iconComponent = typeof icon === 'string' && <SvgIcon icon={icon} {...iconProps} />;

    return (
      <InputWrapper
        onClick={onClick}
        readOnly={readOnly}
        disabled={disabled}
        isActive={isActive}
        {...wrapperProps}
        error={error}
        className={className}
      >
        {leftAction}

        {iconPosition === NestedIconPosition.LEFT && iconComponent}

        <ChildInput>
          {children ? (
            children({ ref: combinedRefs })
          ) : (
            <InlineInput {...props} ref={combinedRefs} readOnly={readOnly} disabled={disabled} />
          )}
        </ChildInput>

        {iconPosition === NestedIconPosition.RIGHT && iconComponent}

        {rightAction}
      </InputWrapper>
    );
  }
);

export type DefaultInputProps = Either<NestedInputProps, PlainInputProps>;

const Input = React.forwardRef<HTMLInputElement, DefaultInputProps>(({ nested, children, ...props }, ref) => {
  if (props.icon || children || props.leftAction || props.rightAction || nested) {
    return (
      <NestedInput {...props} ref={ref}>
        {children}
      </NestedInput>
    );
  }

  return <PlainInput {...props} ref={ref} />;
});

export default Input;
