import { colors, ThemeColor } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs/styled';

import SearchLabel from '../../../../SearchLabel';
import { ITEM_HEIGHT } from '../../../constants';
import ItemNameIcon from '../../../ItemNameIcon';

interface ContainerProps {
  isActive?: boolean;
  disabled?: boolean;
  isDragging?: boolean;
  isPlaceholder?: boolean;
  isDraggingPreview?: boolean;
}

export const Container = styled.div<ContainerProps>`
  ${transition('color')};

  padding-left: 8px;
  padding-right: 8px;
  display: flex;
  align-items: center;
  line-height: ${ITEM_HEIGHT}px;

  height: ${ITEM_HEIGHT}px;
  font-size: 13px;
  color: ${({ isPlaceholder }) => (isPlaceholder ? '#8da2b5' : '#132144')};

  cursor: pointer;
  border-radius: 5px;
  user-select: none;

  &:hover ${ItemNameIcon} {
    opacity: 1;
  }

  ${({ isActive, isDraggingPreview }) =>
    isActive &&
    !isDraggingPreview &&
    css`
      color: ${colors(ThemeColor.PRIMARY)};
      font-weight: 600;

      & ${SearchLabel} {
        color: ${colors(ThemeColor.PRIMARY)};
      }

      & ${ItemNameIcon} {
        color: rgba(19, 33, 68, 0.85);
        opacity: 1;
      }
    `};

  ${({ disabled }) =>
    disabled &&
    css`
      pointer-events: none;
    `};

  ${({ isDragging }) =>
    isDragging &&
    css`
      opacity: 0;
      cursor: grabbing;
    `}

  ${({ isDraggingPreview }) =>
    isDraggingPreview &&
    css`
      cursor: grabbing;
      box-shadow: 0 6px 12px 0 rgba(17, 49, 96, 0.16), 0 0 0 1px rgba(17, 49, 96, 0.06);
      background: linear-gradient(to bottom, rgba(238, 244, 246, 0.3), rgba(238, 244, 246, 0.45)),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9));
    `}
`;

export const IconContainer = styled.div`
  width: 24px;
  flex-shrink: 0;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 6px;
`;
