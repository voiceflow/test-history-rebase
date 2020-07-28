import { styled } from '@/hocs';
import DragTarget, { DragTargetProps } from '@/pages/Canvas/components/DragTarget';
import { NODE_DRAGGING_CLASSNAME } from '@/pages/Canvas/constants';

const NodeDragTarget = styled(DragTarget)<DragTargetProps>`
  &.${NODE_DRAGGING_CLASSNAME} {
    pointer-events: none;
  }
`;

export default NodeDragTarget;
