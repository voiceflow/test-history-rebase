import { StripeElementStyle } from '@stripe/stripe-js';
import { Animations, colors, StyledInputProps, ThemeColor } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';
import { ANIMATION_SPEED } from '@/styles/theme';

interface ContainerProps extends StyledInputProps {
  error?: boolean;
  disabled?: boolean;
}

export const CardElementContainer = styled.div<ContainerProps>`
  width: 100%;

  .StripeElement {
    display: block;
    width: 100%;
    min-height: ${({ theme }) => theme.components.input.height}px;
    padding: 12px 15px;
    color: #132042;
    font: normal 15px Open Sans, Arial, sans-serif;
    font-size: 15px;
    line-height: 20px;
    box-shadow: 0 0 3px 0 rgba(17, 49, 96, 0.06);
    cursor: text;
    transition: background-color 0.12s linear, color 0.12s linear, border-color 0.12s linear, box-shadow 0.12s linear, max-height 0.12s linear;
    border-radius: 6px;
    border: 1px solid #d2dae2;
  }

  .StripeElement--focus {
    border: 1px solid ${colors(ThemeColor.BLUE)};
    outline: 0;
    box-shadow: 0 0 3px 0 rgba(17, 49, 96, 0.06);
  }

  .CbHosted {
    display: block;
    width: 100%;
    min-height: ${({ theme }) => theme.components.input.height}px;
    padding: 12px 15px;
    color: #132042;
    font: normal 15px Open Sans, Arial, sans-serif;
    font-size: 15px;
    line-height: 20px;
    box-shadow: 0 0 3px 0 rgba(17, 49, 96, 0.06);
    cursor: text;
    transition: background-color 0.12s linear, color 0.12s linear, border-color 0.12s linear, box-shadow 0.12s linear, max-height 0.12s linear;
    border-radius: 6px;
    border: 1px solid #d2dae2;
  }

  .CbHosted--focus {
    border: 1px solid ${colors(ThemeColor.BLUE)};
    outline: 0;
    box-shadow: 0 0 3px 0 rgba(17, 49, 96, 0.06);
  }

  .CardIcon-fill {
    fill: red;
  }

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
      pointer-events: none;
    `}

  ${({ error }) =>
    error &&
    css`
      .StripeElement--focus,
      .StripeElement {
        border: 1px solid #bd425f !important;
      }

      .CbHosted--focus,
      .CbHosted {
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

export const chargebeeInputStyle = {
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
  empty: {},
};

export const ErrorMessage = styled.span`
  color: #8da2b5;
  margin-top: 8px;
  font-size: 13px;
  height: 0%;
  color: #bd425f;
  line-height: normal;

  animation: ${Animations.fadeInKeyframes} ${ANIMATION_SPEED}s ease, ${Animations.moveInTopKeyframes} ${ANIMATION_SPEED}s ease,
    ${Animations.scaleInYKeyframes} 0.1s ease;
  transform-origin: top;
`;
