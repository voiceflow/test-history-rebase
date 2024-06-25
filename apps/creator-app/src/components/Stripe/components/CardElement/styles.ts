import type * as stripeJs from '@stripe/stripe-js';
import type { StyledInputProps, SvgIconTypes } from '@voiceflow/ui';
import { inputStyle } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

type ContaienrProps = StyledInputProps & {
  disabled?: boolean;
};

export const Container = styled.div<ContaienrProps>`
  ${inputStyle}
  border: 1px solid ${({ borderColor }) => borderColor} !important;
  box-sizing: border-box;

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
      pointer-events: none;
    `}

  .StripeElement {
    box-sizing: unset;
    width: unset;
    padding: unset;
    border: unset;
    border-radius: unset;
    box-shadow: unset;
    transition: unset;
    height: 20px;

    &.StripeElement--focus {
      color: unset !important;
      border: unset !important;
      box-shadow: unset !important;
    }
  }
`;

export const CardElementContainer = styled.div`
  position: absolute;
  top: 0;
  left: 34px;
  right: -32px;
`;

export const stripeInputStyle: stripeJs.StripeElementStyle = {
  base: {
    fontSize: '15px',
    fontWeight: '400',
    fontFamily: "'Open Sans', sans-serif",
    color: '#132144',
    fontSmoothing: 'antialiased',

    '::placeholder': {
      color: '#8da2b5',
      fontWeight: '400',
    },
  },
  invalid: {
    color: '#132144',

    '::placeholder': {
      color: '#8da2b5',
    },
  },
};

export const getColor = (error: string, complete: boolean, focused?: boolean): string => {
  if (error) {
    return '#BD425F';
  }

  if (complete) {
    return '#279745';
  }

  if (focused) {
    return '#5D9DF5';
  }

  return '#d4d9e6';
};

export const getIcon = (error: string, complete: boolean): SvgIconTypes.Icon => {
  if (error) {
    return 'error';
  }

  if (complete) {
    return 'checkmark';
  }

  return 'creditCard';
};
