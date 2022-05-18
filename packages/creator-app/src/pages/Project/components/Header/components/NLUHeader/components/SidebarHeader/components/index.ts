import { css, styled, transition } from '@/hocs';

export const ErrorBubble = styled.div<{ active: boolean }>`
  ${transition()}
  padding: 1px 8px;
  background: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  border: solid 1px #eaeff4;
  cursor: pointer;
  color: #62778c;

  ${({ active }) =>
    active &&
    css`
      background: #eef4f6;
    `}
`;
