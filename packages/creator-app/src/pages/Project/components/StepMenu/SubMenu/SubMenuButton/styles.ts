import { Box } from '@voiceflow/ui';

import { itemDragPlaceholder } from '@/assets';
import { css, styled, transition } from '@/hocs/styled';

interface SubMenuButtonContainerProps {
  isClicked: boolean;
  isDragging: boolean;
  isDraggingPreview?: boolean;
  isContextMenuOpen?: boolean;
  disabled?: boolean;
  customDisplay?: string;
  isLibrary?: boolean;
}

export const SubMenuButtonContainer = styled(Box.FlexStart)<SubMenuButtonContainerProps>`
  ${transition('box-shadow', 'background-color', 'transform', 'background-image')}

  ${({ isLibrary }) =>
    isLibrary
      ? css`
          max-width: 230px;
        `
      : css`
          min-width: 142px;
        `}

  height: 38px;
  padding: 9px 16px 8px;
  border-radius: 6px;
  cursor: grab;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  &:active {
    cursor: grabbing;
  }

  ${({ disabled, isContextMenuOpen }) =>
    disabled
      ? css`
          cursor: default !important;
        `
      : !isContextMenuOpen &&
        css`
          &:hover {
            box-shadow: 0 2px 3px 0 rgba(19, 33, 68, 0.08), 0 0 0 1px rgba(19, 33, 68, 0.06);
            background-color: #fdfdfd;
          }
        `}

  ${({ isClicked, isContextMenuOpen, isDragging }) =>
    isClicked &&
    !isDragging &&
    !isContextMenuOpen &&
    css`
      transform: rotate(-2deg);
    `}

  ${({ isContextMenuOpen }) =>
    isContextMenuOpen &&
    css`
      background-color: rgba(238, 244, 246, 0.85);
    `}

  ${({ isClicked, disabled }) =>
    isClicked &&
    disabled &&
    css`
      transform: none;
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
      width: auto;
      transform: rotate(-2deg);
      box-shadow: 0 4px 8px 0 rgba(17, 49, 96, 0.08), 0 0 0 1px rgba(17, 49, 96, 0.08);
      background-image: linear-gradient(to bottom, rgba(238, 244, 246, 0.3), rgba(238, 244, 246, 0.6)), linear-gradient(to bottom, #ffffff, #ffffff);
      cursor: grabbing;
    `}

    ${({ customDisplay }) =>
    customDisplay &&
    css`
      display: ${customDisplay};
    `}
`;
