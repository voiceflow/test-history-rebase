import { colors, OverflowText, SvgIcon, ThemeColor } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs';

import SearchLabel from '../../../../SearchLabel';
import { ITEM_HEIGHT } from '../../../constants';

interface ItemContainerProps {
  isActive?: boolean;
  disabled?: boolean;
  isDragging?: boolean;
  isPlaceholder?: boolean;
  isDraggingPreview?: boolean;
}

export const IntentContainer = styled(OverflowText)<ItemContainerProps>`
  ${transition('color')};
  padding-left: 16px;
  display: flex;
  align-items: center;
  line-height: ${ITEM_HEIGHT}px;
  width: 100%;
  height: ${ITEM_HEIGHT}px;
  font-size: 13px;
  color: ${({ isPlaceholder }) => (isPlaceholder ? '#8da2b5' : '#132144')};
  cursor: pointer;
  border-radius: 5px;
  user-select: none;

  & > ${SvgIcon.Container} {
    margin-right: 12px;
    color: #6e849a;
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
