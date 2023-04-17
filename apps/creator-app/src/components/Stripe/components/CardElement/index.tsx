import { CardElement } from '@stripe/react-stripe-js';
import * as stripeJs from '@stripe/stripe-js';
import { Box, preventDefault, SvgIcon, TippyTooltip, useEnableDisable, useToggle } from '@voiceflow/ui';
import React from 'react';

import * as S from './styles';

interface StripeCardElementProps {
  disabled?: boolean;
  stripeOnChange?: (meta: stripeJs.StripeCardElementChangeEvent) => void;
  onChangeComplete?: (complete: boolean) => void;
}

const StripeCardElement: React.FC<StripeCardElementProps> = ({ onChangeComplete, disabled = false, stripeOnChange }) => {
  const cardElementRef = React.useRef<stripeJs.StripeCardElement | null>(null);
  const boxRef = React.useRef<HTMLDivElement>(null);
  const errorMessageRef = React.useRef('message');
  const [error, updateError] = React.useState('');
  const [complete, updateComplete] = useToggle(false);
  const [focused, enableFocus, disableFocus] = useEnableDisable();

  const onClick = () => {
    cardElementRef.current?.focus();

    if (boxRef.current) {
      boxRef.current.scrollLeft = 0;
    }
  };

  const onReady = (element: stripeJs.StripeCardElement) => {
    cardElementRef.current = element;
  };

  const onChange = (meta: stripeJs.StripeCardElementChangeEvent) => {
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
    <TippyTooltip visible={!!error && focused} content={error || errorMessageRef.current} placement="bottom-start" offset={[0, 5]}>
      <S.Container disabled={disabled} onClick={preventDefault(onClick)} borderColor={S.getColor(error, complete, focused)}>
        <Box ref={boxRef} overflow="hidden" pl={2} pt={2} position="relative">
          <SvgIcon icon={S.getIcon(error, complete)} color={S.getColor(error, complete)} />

          <S.CardElementContainer>
            <CardElement
              onReady={onReady}
              onBlur={disableFocus}
              onFocus={enableFocus}
              onChange={onChange}
              options={{ style: S.stripeInputStyle, hideIcon: true }}
            />
          </S.CardElementContainer>
        </Box>
      </S.Container>
    </TippyTooltip>
  );
};

export default StripeCardElement;
