import { Box } from '@voiceflow/ui';

import { itemDragPlaceholder } from '@/assets';
import { css, styled, transition } from '@/hocs';

interface SubMenuButtonContainerProps {
  isDragging: boolean;
  isClicked: boolean;
  isDraggingPreview?: boolean;
}

export const SubMenuButtonContainer = styled(Box.FlexStart)<SubMenuButtonContainerProps>`
  width: 142px;
  min-height: 38px;
  padding: 9px 16px 8px;
  border-radius: 6px;
  transition-delay: 5s

  &:hover {
    cursor: grab;
    box-shadow: 0 2px 3px 0 rgba(19, 33, 68, 0.08), 0 0 0 1px rgba(19, 33, 68, 0.06);
    background-color: #fdfdfd;
  }

  &:active {
    cursor: grabbing;
  }

  ${transition('box-shadow', 'background-color', 'transform', 'background-image')}

  ${({ isClicked }) =>
    isClicked &&
    css`
      transition: transform 0s;
      transform: rotate(-2deg);
    `}

  ${({ isDragging }) =>
    isDragging &&
    css`
      box-shadow: 0 0 0 1px rgba(19, 33, 68, 0.08) !important;
      cursor: grabbing;
      background-image: url(${itemDragPlaceholder});
      background-repeat: no-repeat;
      background-size: cover;
    `}

  ${({ isDraggingPreview }) =>
    isDraggingPreview &&
    css`
      width: 142px;
      min-height: 38px;
      transform: rotate(-2deg);
      box-shadow: 0 4px 8px 0 rgba(17, 49, 96, 0.08), 0 0 0 1px rgba(17, 49, 96, 0.08);
      background-image: linear-gradient(to bottom, rgba(238, 244, 246, 0.3), rgba(238, 244, 246, 0.6)), linear-gradient(to bottom, #ffffff, #ffffff);
      cursor: grabbing;
    `}
`;

export const SubMenuButtonOuterContainer = styled.div``;
