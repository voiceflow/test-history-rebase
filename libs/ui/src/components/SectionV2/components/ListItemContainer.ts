import Flex from '@ui/components/Flex';
import { css, styled, units } from '@ui/styles';

import ListItemActionsContainer from './ListItemActionsContainer';
import ListItemContent from './ListItemContent';

export interface ListItemContainerProps {
  isDragging?: boolean;
  isDraggingPreview?: boolean;
}

const ListItemContainer = styled(Flex)<ListItemContainerProps>`
  min-height: ${units(5.25)}px;
  margin-left: ${units(-2)}px;
  max-width: calc(100% + 16px);
  position: relative;
  user-select: none;

  ${({ isDragging }) =>
    isDragging &&
    css`
      cursor: grabbing;

      & > ${ListItemContent} {
        opacity: 0;
        cursor: grabbing;
      }
    `}

  ${({ isDraggingPreview }) =>
    isDraggingPreview &&
    css`
      box-shadow:
        0 4px 8px 0 rgba(17, 49, 96, 0.08),
        0 0 0 1px rgba(17, 49, 96, 0.08);
      background-color: #fff;
      background-image: linear-gradient(to bottom, rgba(238, 244, 246, 0.3), rgba(238, 244, 246, 0.6));
      border-radius: 6px;
      margin: 0 ${units(2)}px 0 ${units(0)}px;

      ${ListItemActionsContainer} {
        opacity: 0;
      }
    `}
`;

export default ListItemContainer;
