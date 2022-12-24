import { css, styled } from '@/hocs/styled';

interface PaymentContainerProps {
  notAllowed: boolean;
  isLoading: boolean;
}

const PaymentContainer = styled.div<PaymentContainerProps>`
  width: 100%;

  ${({ notAllowed }) => notAllowed && 'cursor: not-allowed'};

  ${({ isLoading }) =>
    !!isLoading &&
    css`
      display: flex;
      align-items: center;
      justify-content: center;
    `}
`;

export default PaymentContainer;
