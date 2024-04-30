import { styled, transition } from '@/styles';

export const Content = styled.div`
  width: 100%;
  height: 100%;
`;

export const Container = styled.div<{
  width?: number;
  height?: number;
  minHeight?: number;
  minWidth?: number;
  maxWidth?: number;
  maxHeight?: number;
}>`
  height: ${({ height }) => (height !== undefined ? `${height}px` : '100%')};
  width: ${({ width }) => (width !== undefined ? `${width}px` : '100%')};

  min-height: ${({ minHeight }) => (minHeight !== undefined ? `${minHeight}px` : 0)};
  min-width: ${({ minWidth }) => (minWidth !== undefined ? `${minWidth}px` : 0)};

  max-height: ${({ maxHeight }) => (maxHeight !== undefined ? `${maxHeight}px` : '100%')};
  max-width: ${({ maxWidth }) => (maxWidth !== undefined ? `${maxWidth}px` : '100%')};

  display: flex;

  &.resizing {
    pointer-events: none;
    user-select: none;
  }
`;

export const HorizontalHandle = styled.div`
  ${transition('background-color')}
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background-color: #dfe3ed;
  cursor: row-resize;
  /* z-index: 2; */

  &:hover,
  &.resizing {
    background-color: #5d9df5;
  }

  &:before {
    content: '';
    position: absolute;
    top: -2px;
    left: 0;
    right: 0;
    bottom: -2px;
    cursor: row-resize;
  }

  &.resizing:before {
    top: -10px;
    bottom: -10px;
  }
`;

export const VerticalHandle = styled.div<{ isResizing?: boolean }>`
  ${transition('background-color')}
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 1px;
  background-color: #dfe3ed;
  cursor: col-resize;
  /* z-index: 2; */
  pointer-events: auto;

  &:hover,
  &.resizing {
    background-color: #5d9df5;
  }

  &:before {
    content: '';
    position: absolute;
    right: -2px;
    left: -2px;
    top: 0;
    bottom: 0;
    cursor: col-resize;
  }

  &.resizing:before {
    left: -10px;
    right: -10px;
  }
`;
