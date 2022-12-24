import { Box, preventDefault, SvgIcon, SvgIconTypes, TippyTooltip, useEnableDisable, useToggle } from '@voiceflow/ui';
import React from 'react';
import { CardElement, ReactStripeElements } from 'react-stripe-elements';

import { StripeCardElementWrapper, stripeInputStyle, Wrapper } from './components';

const getColor = (error: string, complete: boolean, focused?: boolean): string => {
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

const getIcon = (error: string, complete: boolean): SvgIconTypes.Icon => {
  if (error) {
    return 'error';
  }

  if (complete) {
    return 'checkmark';
  }

  return 'creditCard';
};

interface StripeCardElementProps {
  disabled?: boolean;
  stripeOnChange?: (meta: ReactStripeElements.ElementChangeResponse) => void;
  onChangeComplete?: (complete: boolean) => void;
}

const StripeCardElement: React.FC<StripeCardElementProps> = ({ onChangeComplete, disabled = false, stripeOnChange }) => {
  const cardElementRef = React.useRef<CardElement>(null);
  const boxRef = React.useRef<HTMLDivElement>(null);
  const errorMessageRef = React.useRef('message');
  const [error, updateError] = React.useState('');
  const [complete, updateComplete] = useToggle(false);
  const [focused, enableFocus, disableFocus] = useEnableDisable();

  const onClick = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    cardElementRef.current?.getElement()?.focus();

    if (boxRef.current) {
      boxRef.current.scrollLeft = 0;
    }
  };

  const onChange = (meta: ReactStripeElements.ElementChangeResponse) => {
    const { error: nextError, complete: nextComplete } = meta;

    updateError(nextError?.message ?? '');
    updateComplete(nextComplete);

    stripeOnChange?.(meta);
    onChangeComplete?.(nextComplete);
  };

  React.useLayoutEffect(() => {
    if (boxRef.current) {
      // the only way I've found to disable auto-scroll to focussed input
      boxRef.current.scrollLeft = 0;
    }
  });

  errorMessageRef.current = error || errorMessageRef.current;

  return (
    <TippyTooltip open={!!error && focused} title={error || errorMessageRef.current} position="bottom-start" animation="fade" distance={5}>
      <Wrapper disabled={disabled} onClick={preventDefault(onClick)} borderColor={getColor(error, complete, focused)}>
        <Box ref={boxRef} overflow="hidden" pl={2} pt={2} position="relative">
          <SvgIcon icon={getIcon(error, complete)} color={getColor(error, complete)} />

          <StripeCardElementWrapper>
            <CardElement ref={cardElementRef} style={stripeInputStyle} hideIcon onBlur={disableFocus} onFocus={enableFocus} onChange={onChange} />
          </StripeCardElementWrapper>
        </Box>
      </Wrapper>
    </TippyTooltip>
  );
};

export default StripeCardElement;
