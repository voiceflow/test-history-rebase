import { SvgIcon } from '@voiceflow/ui';

import { dragPlaceholderStyles } from '@/components/DragPlaceholder';
import { css, styled } from '@/hocs/styled';

import ItemNameContainer from '../../ItemNameContainer';

export const ComponentItemNameContainer = styled(ItemNameContainer)<{
  isClicked?: boolean;
  isDraggingXEnabled?: boolean;
  viewerOnly: boolean;
}>`
  position: relative;
  cursor: pointer;

  padding: 5px 12px 5px 7px;

  ${SvgIcon.Container} {
    opacity: 0.85;
  }

  &:hover ${SvgIcon.Container} {
    opacity: 1;
  }

  ${({ isDragging, isDraggingPreview }) =>
    (isDragging || isDraggingPreview) &&
    css`
      ${SvgIcon.Container} {
        color: rgba(19, 33, 68, 0.85) !important;
        opacity: 1 !important;
      }
    `}

  ${({ isDragging, isDraggingXEnabled }) =>
    isDragging &&
    isDraggingXEnabled &&
    css`
      opacity: 1 !important;
      box-shadow: none;
      cursor: grabbing;
      border-color: #eaeff4;
      ${dragPlaceholderStyles}
    `}

  ${({ isDraggingPreview, isDraggingXEnabled }) =>
    isDraggingPreview &&
    isDraggingXEnabled &&
    css`
      box-shadow: 0 8px 16px 0 rgba(17, 49, 96, 0.16), 0 0 0 1px rgba(17, 49, 96, 0.06);
      background-image: linear-gradient(to bottom, rgba(238, 244, 246, 0.3), rgba(238, 244, 246, 0.6)), linear-gradient(to bottom, #ffffff, #ffffff);
      transform: rotate(-2deg);
      width: 100%;
    `}

  ${({ viewerOnly }) =>
    viewerOnly &&
    css`
      &:hover {
        box-shadow: none;
        background: #eef4f6;
      }
    `}

  ${({ isActive }) =>
    isActive &&
    css`
      & ${SvgIcon.Container} {
        opacity: 1;
      }
    `}
`;

export const IconContainer = styled.div`
  width: 24px;
  height: 24px;
  margin-right: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;
