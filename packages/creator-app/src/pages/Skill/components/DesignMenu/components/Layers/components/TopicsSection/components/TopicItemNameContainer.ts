import { Flex } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs';

interface TopicItemNameContainerProps {
  isActive?: boolean;
  isDragging?: boolean;
  disableHover?: boolean;
  isDraggingPreview?: boolean;
  isContextMenuOpen?: boolean;
}

export const TOPIC_ITEM_HEIGHT = 36;

const TopicItemNameContainer = styled(Flex)<TopicItemNameContainerProps>`
  ${transition('background', 'border-color')}

  width: 100%;
  padding: 6px 12px 6px 6px;
  min-height: ${TOPIC_ITEM_HEIGHT}px;
  border-radius: 5px;
  border: solid 1px transparent;
  border-bottom: solid 1px transparent;
  font-size: 13px;
  cursor: pointer;
  background: #fff;

  ${({ disableHover }) =>
    !disableHover &&
    css`
      &:hover {
        background: #eef4f6;
      }
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
      padding-left: 16px;
      box-shadow: 0 6px 12px 0 rgba(17, 49, 96, 0.16), 0 0 0 1px rgba(17, 49, 96, 0.06);
      background: linear-gradient(to bottom, rgba(238, 244, 246, 0.3), rgba(238, 244, 246, 0.45)),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9));
    `}

  ${({ isActive, isDraggingPreview }) =>
    isActive &&
    !isDraggingPreview &&
    css`
      font-weight: 600;
      background: #eef4f6;
      border-color: #dfe3ed;
    `}
`;

export default TopicItemNameContainer;
