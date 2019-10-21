import { css, styled } from '@/hocs';

import { STROKE_COLOR } from '../constants';

const LinkPath = styled.path`
  stroke: rgb(141, 162, 181);
  stroke-width: 1.5px;
  fill: transparent;

  ${({ isHovering }) =>
    isHovering &&
    css`
      stroke: ${STROKE_COLOR};
      stroke-dasharray: 10, 2;
      animation: dash 16s linear infinite;
    `}
`;

export default LinkPath;
