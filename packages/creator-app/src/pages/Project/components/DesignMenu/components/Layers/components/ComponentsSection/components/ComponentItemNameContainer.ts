import { SvgIcon } from '@voiceflow/ui';

import { dragPlaceholderStyles } from '@/components/DragPlaceholder';
import { css, styled, transition } from '@/hocs';

import ItemNameContainer from '../../ItemNameContainer';

const ComponentItemNameContainer = styled(ItemNameContainer)<{
  isClicked?: boolean;
  isDraggingXEnabled?: boolean;
  viewerOnly: boolean;
}>`
  position: relative;
  cursor: pointer;

  padding: 6px 12px 6px 16px;

  ${SvgIcon.Container} {
    ${transition('opacity')}
    display: block;
    margin-left: 8px;
    opacity: 0;
  }

  ${({ isDraggingPreview }) =>
    isDraggingPreview &&
    css`
      ${SvgIcon.Container} {
        opacity: 1;
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

      ${SvgIcon.Container} {
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

      ${SvgIcon.Container} {
        opacity: 0 !important;
      }
    `}

  ${({ viewerOnly }) =>
    viewerOnly &&
    css`
      &:hover {
        box-shadow: none;
        background: #eef4f6;
      }
    `}
`;

export default ComponentItemNameContainer;
