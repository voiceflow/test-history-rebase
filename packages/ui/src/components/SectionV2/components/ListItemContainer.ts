import Flex from '@ui/components/Flex';
import { css, styled, units } from '@ui/styles';

import ActionsContainer from './ActionsContainer';
import ListItemContent from './ListItemContent';

export interface ListItemContainerProps {
  isDragging?: boolean;
  isContextMenuOpen?: boolean;
  isDraggingPreview?: boolean;
}

const ListItemContainer = styled(Flex)<ListItemContainerProps>`
  min-height: ${units(5.25)}px;
  margin-left: ${units(-2)}px;
  max-width: calc(100% + 16px);

  ${({ isDragging }) =>
    isDragging &&
    css`
      & > ${ListItemContent} {
        opacity: 0;
      }

      & > ${ActionsContainer} {
        opacity: 0;
      }
    `}

  ${({ isDraggingPreview }) =>
    isDraggingPreview &&
    css`
      margin: 0 ${units(2)}px;
      background: linear-gradient(180deg, rgba(238, 244, 246, 0.3) 0%, rgba(238, 244, 246, 0.45) 100%), rgba(255, 255, 255, 0.8);
      box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.06), 0 ${units()}px ${units(2)}px 0 rgba(17, 49, 96, 0.16);
      border-radius: 7px;
    `}

  ${({ isContextMenuOpen }) =>
    isContextMenuOpen &&
    css`
      background: linear-gradient(-180deg, rgba(238, 244, 246, 0.3) 0%, rgba(238, 244, 246, 0.45) 100%), #fff;
    `}
`;

export default ListItemContainer;
