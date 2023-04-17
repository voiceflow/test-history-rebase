import { css, styled, transition } from '@ui/styles';

const ProgressBar = styled.div<{ percent: number }>`
  ${({ percent }) =>
    percent &&
    css`
      width: ${percent}%;
      ${transition('width')};
    `};
  background-color: #f6f9fa;
  position: absolute;
  left: 0;
  z-index: 0;
  height: 100%;
`;

export default ProgressBar;
