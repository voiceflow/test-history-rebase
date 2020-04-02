import { css, styled } from '@/hocs';

const ProgressLine = styled.div<{ active?: boolean }>`
  width: 24px;
  display: inline-block;
  margin: 0 1px;
  height: 1px;
  background: #dfe3ed;
  ${({ active }) =>
    active &&
    css`
      background: #2c85ff;
    `}
`;

export default ProgressLine;
