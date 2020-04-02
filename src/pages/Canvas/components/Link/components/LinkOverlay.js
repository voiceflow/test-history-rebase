import { css, styled } from '@/hocs';

import { STROKE_COLOR } from '../constants';

const LinkOverlay = styled.path`
  stroke: ${STROKE_COLOR};
  stroke-width: 15px;
  stroke-opacity: 0;
  fill: transparent;
  pointer-events: auto;
  transition: ease 0.15s all;

  ${({ isHovering, isNewStyle }) =>
    isHovering &&
    !isNewStyle &&
    css`
      stroke-opacity: 0.1;
      cursor: pointer;
    `}

  @keyframes dash {
    to {
      stroke-dashoffset: -1000;
    }
  }
`;

export default LinkOverlay;
