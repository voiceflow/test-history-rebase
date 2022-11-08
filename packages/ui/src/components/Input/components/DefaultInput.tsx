import composeRef from '@seznam/compose-react-refs';
import SvgIcon, { SvgIconTypes } from '@ui/components/SvgIcon';
import { css, styled } from '@ui/styles';
import { Either } from '@ui/types';
import React from 'react';

import { hideNumberArrows, inputStyle, StyledInputProps } from '../styles';
import { NestedIconPosition } from '../types';
import ChildInput from './ChildInput';
import InlineInput, { InlineInputProps } from './InlineInput';
import InputWrapper, { InputWrapperProps } from './InputWrapper';

export interface PlainInputProps extends StyledInputProps, Omit<React.ComponentProps<'input'>, 'ref' | 'children'> {}

const PlainInput = styled.input<StyledInputProps>`
  ${inputStyle}

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
  onIconClick?: () => void;
}

export const NestedInput = React.forwardRef<HTMLInputElement, NestedInputProps>(
  (
    {
      icon,
      error,
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
      onIconClick,
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

    const iconComponent = typeof icon === 'string' && <SvgIcon icon={icon} onClick={onIconClick} {...iconProps} />;

    return (
      <InputWrapper onClick={onClick} readOnly={readOnly} disabled={disabled} {...wrapperProps} error={error} className={className}>
        {leftAction}

        {iconPosition === NestedIconPosition.LEFT && iconComponent}

        <ChildInput>
          {children ? children({ ref: combinedRefs }) : <InlineInput {...props} ref={combinedRefs} readOnly={readOnly} disabled={disabled} />}
        </ChildInput>

        {iconPosition === NestedIconPosition.RIGHT && iconComponent}

        {rightAction}
      </InputWrapper>
    );
  }
);

export type DefaultInputProps = Either<NestedInputProps, PlainInputProps>;

const Input = React.forwardRef<HTMLInputElement, DefaultInputProps>(({ nested, ...props }, ref) => {
  if (props.icon || props.children || props.leftAction || props.rightAction || nested) {
    return <NestedInput {...props} ref={ref} />;
  }

  return <PlainInput {...props} ref={ref} />;
});

export default Input;
