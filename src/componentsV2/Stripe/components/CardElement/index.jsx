import PropTypes from 'prop-types';
import React from 'react';
import { CardElement } from 'react-stripe-elements';
import { Tooltip } from 'react-tippy';

import SvgIcon from '@/components/SvgIcon';
import Flex from '@/componentsV2/Flex';
import { useEnableDisable, useToggle } from '@/hooks';

import { StripeCardElementWrapper, Wrapper, stripeInputStyle } from './styled';

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

export default function StripeCardElement({ onChangeComplete, disabled = false }) {
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
    onChangeComplete?.(nextComplete);
  };

  errorMessageRef.current = error || errorMessageRef.current;

  return (
    <Tooltip open={!!error && focused} title={error || errorMessageRef.current} position="bottom-start" theme="warning" animation="fade" distance={5}>
      <Wrapper id="poo" disabled={disabled} onClick={onClick} borderColor={getColor(error, complete, focused)}>
        <Flex style={{ overflow: 'hidden' }}>
          <SvgIcon icon={getIcon(error, complete)} color={getColor(error, complete)} />

          <StripeCardElementWrapper>
            <CardElement ref={cardElementRef} style={stripeInputStyle} hideIcon onBlur={disableFocus} onFocus={enableFocus} onChange={onChange} />
          </StripeCardElementWrapper>
        </Flex>
      </Wrapper>
    </Tooltip>
  );
}

StripeCardElement.propTypes = {
  onChangeComplete: PropTypes.func,
};
