import _isString from 'lodash/isString';
import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import { styled } from '@/hocs';
import { useCombinedRefs } from '@/hooks/ref';

import InlineInput from './InlineInput';
import { ChildInput, InputWrapper, inputStyle } from './styled';

const PlainInput = styled.input`
  ${inputStyle}
`;

// eslint-disable-next-line react/display-name
export const NestedInput = React.forwardRef(
  ({ icon, error, iconProps, wrapperProps = {}, disabled, children, leftAction, rightAction, ...props }, ref) => {
    const inputRef = React.useRef();
    const combinedRef = useCombinedRefs(ref, inputRef);

    const onClick = () => {
      inputRef.current?.focus();
    };

    return (
      <InputWrapper onClick={onClick} disabled={disabled} {...wrapperProps} error={error}>
        {leftAction}
        {_isString(icon) && <SvgIcon icon={icon} {...iconProps} />}
        <ChildInput>{children ? children({ ref: combinedRef }) : <InlineInput {...props} ref={combinedRef} disabled={disabled} />}</ChildInput>
        {rightAction}
      </InputWrapper>
    );
  }
);

// eslint-disable-next-line react/display-name
const Input = React.forwardRef((props, ref) => {
  if (props.icon || props.children || props.leftAction || props.rightAction) {
    return <NestedInput {...props} ref={ref} />;
  }

  return <PlainInput {...props} ref={ref} />;
});

export default Input;
