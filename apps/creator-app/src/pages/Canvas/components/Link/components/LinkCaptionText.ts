import { PlaceholderText } from '@/components/SlateEditable/components/Placeholder';
import { css, styled } from '@/hocs/styled';
import { LINK_HIGHLIGHTED_CLASSNAME } from '@/pages/Canvas/constants';

import { HIGHLIGHT_COLOR } from '../constants';

export interface LinkCaptionTextProps {
  color: string;
  isEmpty?: boolean;
  isLineActive?: boolean;
  isHighlighted?: boolean;
}

export const MIN_HEIGHT = 24;
export const PLACEHOLDER_WIDTH = 115;

const LinkCaptionText = styled.div<LinkCaptionTextProps>`
  display: inline-block;
  font-size: 14.3px;
  font-weight: 600;
  white-space: pre;
  color: ${({ color }) => color};
  pointer-events: all;
  line-height: 20px;
  min-height: ${MIN_HEIGHT}px;
  padding: 2px 4px;
  position: relative;
  top: -1px;
  background-color: #f4f6f6 !important;
  cursor: pointer !important;
  pointer-events: ${({ isLineActive }) => (isLineActive ? 'all' : 'none')};
  margin: 0;
  text-align: center;

  ${({ isHighlighted }) =>
    isHighlighted &&
    css`
      color: ${HIGHLIGHT_COLOR};
    `}

  .${LINK_HIGHLIGHTED_CLASSNAME} && {
    color: ${HIGHLIGHT_COLOR};
  }

  & [data-slate-node='element'] {
    width: fit-content;
    min-width: ${({ isEmpty }) => (isEmpty ? PLACEHOLDER_WIDTH - 8 : 1)}px;
    margin: 0 auto;

    & [data-slate-node='text'] {
      white-space: pre;
    }
  }

  & ${PlaceholderText} {
    color: #132144 !important;
    opacity: 0.333 !important;
    font-size: 14.3px;
  }
`;

export default LinkCaptionText;
