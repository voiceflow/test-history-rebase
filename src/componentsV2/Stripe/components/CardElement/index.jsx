import React from 'react';
import { CardElement } from 'react-stripe-elements';
import { Tooltip } from 'react-tippy';

import SvgIcon from '@/components/SvgIcon';
import { useEnableDisable, useToggle } from '@/hooks';

import { StripeCardElementWrapper, Wrapper, strypeInputStyle } from './styled';

const getColor = (error, complete, focused) => {
  if (error) {
    return '#E91E63';
  }

  if (complete) {
    return '#279745';
  }

  if (focused) {
    return '#5D9DF5';
  }

  return '#d4d9e6';
};

const getIcon = (error, complete) => {
  if (error) {
    return 'error';
  }

  if (complete) {
    return 'check2';
  }

  return 'creditCard';
};

export default function StripeCardElement() {
  const cardElementRef = React.useRef();
  const errorMessageRef = React.useRef('message');
  const [error, updateError] = React.useState('');
  const [complete, updateComplete] = useToggle(false);
  const [focused, enableFocus, disableFocus] = useEnableDisable();

  const onClick = () => {
    cardElementRef.current.getElement()?.focus();
  };

  const onChange = ({ error: nextError, complete: nextComplete }) => {
    updateError(nextError?.message);
    updateComplete(nextComplete);
  };

  const color = getColor(error, complete, focused);

  errorMessageRef.current = error || errorMessageRef.current;

  return (
    <Tooltip open={!!error} title={error || errorMessageRef.current} position="top" theme="warning" animation="fade">
      <Wrapper onClick={onClick} borderColor={color}>
        <SvgIcon icon={getIcon(error, complete)} color={color} />

        <StripeCardElementWrapper>
          <CardElement ref={cardElementRef} style={strypeInputStyle} hideIcon onBlur={disableFocus} onFocus={enableFocus} onChange={onChange} />
        </StripeCardElementWrapper>
      </Wrapper>
    </Tooltip>
  );
}
