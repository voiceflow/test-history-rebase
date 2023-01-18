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
      padding: 32px 32px 22px 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    `}
`;

export default PaymentContainer;
