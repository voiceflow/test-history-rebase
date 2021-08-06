import { css, styled } from '@/hocs';
import { LINK_HIGHLIGHTED_CLASSNAME } from '@/pages/Canvas/constants';

import { HIGHLIGHT_COLOR, STROKE_DEFAULT_COLOR } from '../constants';

export interface LinkPathProps {
  strokeColor: string;
  isHighlighted?: boolean;
}

export const getHighlightedStrokeColor = ({ strokeColor }: LinkPathProps): string =>
  strokeColor === STROKE_DEFAULT_COLOR ? HIGHLIGHT_COLOR : strokeColor;

const LinkPath = styled.path<LinkPathProps>`
  fill: none;
  stroke: ${({ strokeColor }) => strokeColor};
  stroke-width: 2px;

  ${({ strokeColor, isHighlighted }) =>
    isHighlighted &&
    css`
      stroke: ${getHighlightedStrokeColor({ strokeColor })};
    `}

  .${LINK_HIGHLIGHTED_CLASSNAME} && {
    stroke: ${getHighlightedStrokeColor};
  }
`;

export default LinkPath;
