import { css, styled } from '@/hocs';

const PaymentContainer = styled.div`
  ${({ isLoading }) =>
    !!isLoading &&
    css`
      display: flex;
      align-items: center;
      justify-content: center;
    `}
`;

export default PaymentContainer;
