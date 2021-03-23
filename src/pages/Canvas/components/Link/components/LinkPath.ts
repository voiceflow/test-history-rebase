import { styled } from '@/hocs';
import { LINK_HIGHLIGHTED_CLASSNAME } from '@/pages/Canvas/constants';

import { HIGHLIGHT_COLOR } from '../constants';

export type LinkPathProps = {
  strokeColor?: string;
  isHighlighted?: boolean;
};

const LinkPath = styled.path<LinkPathProps>`
  fill: none;
  stroke: ${({ isHighlighted, strokeColor = isHighlighted ? HIGHLIGHT_COLOR : 'rgb(141, 162, 181)' }) => strokeColor};
  stroke-width: 2px;
  pointer-events: stroke;

  .${LINK_HIGHLIGHTED_CLASSNAME} & {
    stroke: ${HIGHLIGHT_COLOR};
  }
`;

export default LinkPath;
