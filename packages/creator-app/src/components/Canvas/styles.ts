import { styled } from '@/hocs/styled';
import { CANVAS_CREATING_LINK_BLOCK_VIA_LINK_MODE_CLASSNAME, CANVAS_DRAGGING_CLASSNAME } from '@/pages/Canvas/constants';

import { CANVAS_BUSY_CLASSNAME, CANVAS_INTERACTING_CLASSNAME } from './constants';

interface Size {
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
}

export const RenderLayer = styled.div<{ size: Size }>`
  position: absolute;
  height: ${({ size }) => size.height}px;
  width: ${({ size }) => size.width}px;
  transform-origin: ${({ size }) => size.offsetX}px ${({ size }) => size.offsetY}px;
  pointer-events: none;
  will-change: transform;
`;

export const Container = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  overflow: clip;
  user-select: none;

  .${CANVAS_INTERACTING_CLASSNAME} & {
    cursor: grab;

    > * > * {
      pointer-events: none;
    }
  }

  .${CANVAS_DRAGGING_CLASSNAME} &:not(.${CANVAS_BUSY_CLASSNAME}) {
    cursor: grabbing;
  }

  .${CANVAS_CREATING_LINK_BLOCK_VIA_LINK_MODE_CLASSNAME} & {
    cursor: copy;
  }
`;
