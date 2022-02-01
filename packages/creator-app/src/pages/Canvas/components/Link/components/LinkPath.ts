import { css, styled } from '@/hocs';
import { LINK_HIGHLIGHTED_CLASSNAME } from '@/pages/Canvas/constants';

import { HIGHLIGHT_COLOR } from '../constants';

export interface LinkPathProps {
  strokeColor: string;
  isHighlighted?: boolean;
}

const LinkPath = styled.path<LinkPathProps>`
  fill: none;
  stroke: ${({ strokeColor }) => strokeColor};
  stroke-width: 2px;

  ${({ isHighlighted }) =>
    isHighlighted &&
    css`
      stroke: ${HIGHLIGHT_COLOR};
    `}

  .${LINK_HIGHLIGHTED_CLASSNAME} && {
    stroke: ${HIGHLIGHT_COLOR};
  }
`;

export default LinkPath;
