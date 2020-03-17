import { FlexApart } from '@/components/Flex';
import { css, styled, transition } from '@/hocs';

export type ItemContainerProps = {
  isActive?: boolean;
  isDragging?: boolean;
  withoutHover?: boolean;
  isDraggingPreview?: boolean;
  isContextMenuOpen?: boolean;
};

const ItemContainer = styled(FlexApart)<ItemContainerProps>`
  width: 100%;
  height: 100%;
  padding: 0 14px 0 18px;
  cursor: pointer;
  position: relative;
  font-size: 15px;
  user-select: none;

  &:before {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    background-image: linear-gradient(to bottom, rgba(238, 244, 246, 0.85), #eef4f6);
    border-top: 1px solid rgba(238, 244, 246, 0);
    border-bottom: 1px solid rgba(238, 244, 246, 0);
    opacity: 0;
    z-index: -1;

    ${transition('opacity', 'border', 'transform')};

    content: '';
  }

  ${({ withoutHover }) =>
    !withoutHover &&
    css`
      &:hover&:before {
        opacity: 1;
      }
    `}

  ${({ isActive }) =>
    isActive &&
    css`
      cursor: default;

      &:before {
        border-color: #dfe3ed;
        opacity: 1;
      }
    `}

  ${({ isContextMenuOpen }) =>
    isContextMenuOpen &&
    css`
      &:before {
        opacity: 1;
      }
    `}

  ${({ isDragging }) =>
    isDragging &&
    css`
      box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.1) !important;
      background-image: url(/empty-state.svg);
      background-repeat: no-repeat;
      background-size: cover;
      cursor: grabbing;

      > * {
        opacity: 0;
      }
    `}

  ${({ isDraggingPreview }) =>
    isDraggingPreview &&
    css`
      box-shadow: 0 8px 16px 0 rgba(17, 49, 96, 0.16), 0 0 0 1px rgba(17, 49, 96, 0.06);
      background-image: linear-gradient(to bottom, rgba(238, 244, 246, 0.3), rgba(238, 244, 246, 0.6)), linear-gradient(to bottom, #ffffff, #ffffff);
      cursor: grabbing;
    `}
`;

export default ItemContainer;
