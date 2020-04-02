import { css, styled } from '@/hocs';

import { STROKE_COLOR } from '../constants';

export type LinkPathProps = {
  isHovering?: boolean;
  isNewStyle?: boolean;
  strokeColor?: string;
};

const LinkPath = styled.path<LinkPathProps>`
  stroke: rgb(141, 162, 181);
  stroke-width: 1.5px;
  fill: transparent;

  ${({ isHovering, isNewStyle }) =>
    isHovering &&
    !isNewStyle &&
    css`
      stroke: ${STROKE_COLOR};
      stroke-dasharray: 10, 2;
      animation: dash 16s linear infinite;
    `}

  ${({ strokeColor }) =>
    strokeColor &&
    css`
      stroke: ${strokeColor};
    `}
`;

export default LinkPath;
