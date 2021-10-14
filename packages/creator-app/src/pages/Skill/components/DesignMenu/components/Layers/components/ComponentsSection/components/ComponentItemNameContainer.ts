import { SvgIconContainer } from '@voiceflow/ui';

import { dragPlaceholderStyles } from '@/components/DragPlaceholder';
import { css, styled, transition } from '@/hocs';

import ItemNameContainer from '../../ItemNameContainer';

const ComponentItemNameContainer = styled(ItemNameContainer)<{
  isClicked?: boolean;
  isDraggingXEnabled?: boolean;
}>`
  position: relative;
  cursor: grab;
  padding: 6px 12px 6px 16px;

  ${SvgIconContainer} {
    ${transition('opacity')}
    display: block;
    margin-left: 8px;
    opacity: 0;
  }

  ${({ isDraggingPreview }) =>
    isDraggingPreview &&
    css`
      ${SvgIconContainer} {
        opacity: 1;
      }
    `}

  ${({ isDragging, isDraggingXEnabled }) =>
    isDragging &&
    isDraggingXEnabled &&
    css`
      opacity: 1 !important;
      box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.1) !important;
      cursor: grabbing;
      border-color: #eaeff4;
      ${dragPlaceholderStyles}

      ${SvgIconContainer} {
        opacity: 0 !important;
      }
    `}

  ${({ isDraggingPreview, isDraggingXEnabled }) =>
    isDraggingPreview &&
    isDraggingXEnabled &&
    css`
      box-shadow: 0 8px 16px 0 rgba(17, 49, 96, 0.16), 0 0 0 1px rgba(17, 49, 96, 0.06);
      background-image: linear-gradient(to bottom, rgba(238, 244, 246, 0.3), rgba(238, 244, 246, 0.6)), linear-gradient(to bottom, #ffffff, #ffffff);
      transform: rotate(-2deg);

      ${SvgIconContainer} {
        opacity: 0 !important;
      }
    `}

  ${({ isDragging, disableHover, isClicked, isHovered }) =>
    isHovered &&
    !isDragging &&
    !disableHover &&
    css`
      z-index: 1;
      background: #fff;
      box-shadow: 0 1px 3px 0 rgba(17, 49, 96, 0.16), 0 0 0 1px rgba(17, 49, 96, 0.06), 0 1px 0 0 rgba(19, 33, 68, 0.04);

      ${SvgIconContainer} {
        opacity: 1;
      }

      ${isClicked &&
      css`
        cursor: grabbing;
        transform: rotate(-2deg);
      `}
    `}
`;

export default ComponentItemNameContainer;
