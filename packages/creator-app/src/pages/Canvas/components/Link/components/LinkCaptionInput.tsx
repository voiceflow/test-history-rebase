import EditableText from '@/components/EditableText';
import { css, styled } from '@/hocs';
import { LINK_HIGHLIGHTED_CLASSNAME } from '@/pages/Canvas/constants';

import { getHighlightedStrokeColor } from './LinkPath';

export interface LinkCaptionInput {
  color: string;
  isLineActive?: boolean;
  isHighlighted?: boolean;
}

const LinkCaptionInput = styled(EditableText)<LinkCaptionInput>`
  display: inline-block;
  font-size: 14.3px;
  font-weight: 600;
  color: ${({ color }) => color};
  pointer-events: all;
  line-height: 20px;
  height: 24px;
  padding: 2px 4px;
  position: relative;
  top: -1px;
  background-color: #f9f9f9 !important;
  cursor: pointer !important;
  pointer-events: ${({ isLineActive }) => (isLineActive ? 'all' : 'none')};

  ${({ color, isHighlighted }) =>
    isHighlighted &&
    css`
      color: ${getHighlightedStrokeColor({ strokeColor: color })};
    `}

  .${LINK_HIGHLIGHTED_CLASSNAME} && {
    color: ${({ color, isHighlighted }) => getHighlightedStrokeColor({ strokeColor: color, isHighlighted })};
  }
`;

export default LinkCaptionInput;
