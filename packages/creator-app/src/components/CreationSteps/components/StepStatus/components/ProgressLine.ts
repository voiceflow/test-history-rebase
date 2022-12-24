import { css, styled } from '@/hocs/styled';

const ProgressLine = styled.div<{ active?: boolean }>`
  width: 24px;
  display: inline-block;
  margin: 0 1px;
  height: 2px;
  background: #dfe3ed;
  ${({ active }) =>
    active &&
    css`
      background: #3d82e2;
    `}
`;

export default ProgressLine;
