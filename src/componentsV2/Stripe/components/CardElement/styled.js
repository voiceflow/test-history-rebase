import { styled } from '@/hocs';

export const Wrapper = styled.div`
  display: flex;
  height: 42px;
  padding: 12px 16px;
  border: 1px solid ${({ borderColor }) => borderColor};
  align-items: center;
  box-shadow: 0px 0px 3px rgba(17, 49, 96, 0.06);
  border-radius: 5px;
  box-sizing: border-box;
  ${({ theme }) => theme.transition('border')};

  .StripeElement {
    box-sizing: unset;
    width: unset;
    height: unset;
    padding: unset;
    border: unset;
    border-radius: unset;
    box-shadow: unset;
    transition: unset;

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
`;

export const strypeInputStyle = {
  base: {
    fontSize: '15px',
    lineHeight: '1.4666666667',
    fontWeight: '400',
    fontFamily: '"Open Sans", Helvetica, Arial, sans-serif',
    color: '#132144',

    '::placeholder': {
      fontWeight: '200',
      color: '#8DA2B5',
      opacity: '0.6',
    },
  },
  invalid: {
    color: '#132144',

    '::placeholder': {
      fontWeight: '200',
      color: '#8DA2B5',
      opacity: '0.6',
    },
  },
};
