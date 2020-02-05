import { inputStyle } from '@/componentsV2/Input/styles';
import { styled } from '@/hocs';

export const Wrapper = styled.div`
  ${inputStyle}
  border: 1px solid ${({ borderColor }) => borderColor} !important;
  box-sizing: border-box;

  ${({ disabled }) => (disabled ? 'opacity: 0.5; pointer-events: none;' : '')}

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

export const StripeCardElementWrapper = styled.div`
  flex: 1;
  margin-left: 16px;
  margin-right: -32px;
`;

export const stripeInputStyle = {
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
