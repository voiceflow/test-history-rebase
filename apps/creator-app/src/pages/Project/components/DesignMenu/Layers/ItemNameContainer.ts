import { colors, Flex, ThemeColor } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs/styled';

import SearchLabel from '../SearchLabel';
import { ITEM_HEIGHT } from './constants';
import ItemNameIcon from './ItemNameIcon';

export interface ItemNameContainerProps {
  isActive?: boolean;
  isHovered?: boolean;
  isDragging?: boolean;
  disableHover?: boolean;
  isDraggingPreview?: boolean;
  isContextMenuOpen?: boolean;
}

const ItemNameContainer = styled(Flex)<ItemNameContainerProps>`
  ${transition('background', 'border-color', 'box-shadow', 'color', 'opacity')}

  margin: 0 12px;
  padding: 4px 10px 4px 7px;
  min-height: ${ITEM_HEIGHT}px;
  border-radius: 6px;
  border: solid 1px transparent;
  font-size: 13px;
  line-height: 13px;
  background: #fdfdfd;

  &:hover ${ItemNameIcon} {
    opacity: 0.85;
  }

  ${({ isHovered, disableHover }) =>
    !disableHover &&
    css`
      cursor: pointer;

      ${isHovered &&
      css`
        background: #eef4f6;
      `}
    `}

  ${({ isDragging }) =>
    isDragging &&
    css`
      opacity: 0;
      cursor: grabbing;
    `}

  ${({ isContextMenuOpen }) =>
    isContextMenuOpen &&
    css`
      background: #eef4f6;
    `}

  ${({ isDraggingPreview }) =>
    isDraggingPreview &&
    css`
      margin: 0;
      width: 100%;
      max-width: 100%;
      flex-grow: 1;
      padding-left: 16px;
      box-shadow: 0 6px 12px 0 rgba(17, 49, 96, 0.16), 0 0 0 1px rgba(17, 49, 96, 0.06);
      background-image: linear-gradient(to bottom, rgba(238, 244, 246, 0.3), rgba(238, 244, 246, 0.45)),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9));
    `}

  ${({ isActive, isDragging, isDraggingPreview }) =>
    isActive &&
    !isDragging &&
    !isDraggingPreview &&
    css`
      font-weight: 600;
      background: #eef4f6;
      border-color: #dfe3ed;

      & ${SearchLabel} {
        color: ${colors(ThemeColor.PRIMARY)};
      }

      & ${ItemNameIcon} {
        opacity: 0.85;
        color: #6e849a;
      }
    `}
`;

export default ItemNameContainer;
