import { css, styled } from '@/hocs';

const RadioButtonContainer = styled.div<{ column?: boolean }>`
  display: inline-flex;
  align-items: center;
  vertical-align: middle;

  :not(:last-child) {
    margin-right: 20px;
  }

  ${({ column }) =>
    column &&
    css`
      margin-bottom: 12px;
    `}
`;

export default RadioButtonContainer;
