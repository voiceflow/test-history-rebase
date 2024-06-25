import { styled } from '@/hocs/styled';
import type { DragTargetProps } from '@/pages/Canvas/components/DragTarget';
import DragTarget from '@/pages/Canvas/components/DragTarget';
import { NODE_ACTIVE_CLASSNAME, NODE_DRAGGING_CLASSNAME } from '@/pages/Canvas/constants';

const NodeDragTarget = styled(DragTarget)<DragTargetProps>`
  &.${NODE_DRAGGING_CLASSNAME} {
    pointer-events: none;
  }

  &.${NODE_ACTIVE_CLASSNAME} {
    will-change: transform;
  }
`;

export default NodeDragTarget;
