import { StripeElementStyle } from '@stripe/stripe-js';
import { colors, StyledInputProps, ThemeColor } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';
import { ANIMATION_SPEED } from '@/styles/theme';

interface ContainerProps extends StyledInputProps {
  error?: boolean;
  disabled?: boolean;
}

export const CardElementContainer = styled.div<ContainerProps>`
  width: 100%;

  .StripeElement {
    border-radius: 6px;
    border: 1px solid #d2dae2;
  }

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
      pointer-events: none;
    `}

  .StripeElement--focus {
    border: 1px solid ${colors(ThemeColor.BLUE)};
    outline: 0;
    box-shadow: 0 0 3px 0 rgba(17, 49, 96, 0.06);
  }

  ${({ error }) =>
    error &&
    css`
      .StripeElement--focus,
      .StripeElement {
        border: 1px solid #bd425f !important;
      }
    `}
`;

export const stripeInputStyle: StripeElementStyle = {
  base: {
    fontSize: '15px',
    fontWeight: '400',
    lineHeight: '16px',
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

export const ErrorMessage = styled.span`
  color: #8da2b5;
  margin-top: 8px;
  font-size: 13px;
  height: 0%;
  color: #bd425f;
  line-height: normal;

  will-change: transform;
  animation: fadein ${ANIMATION_SPEED}s ease, movein ${ANIMATION_SPEED}s ease, scaleY 0.1s ease;
  transform-origin: top;
`;
