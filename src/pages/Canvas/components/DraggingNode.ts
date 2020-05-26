import { styled } from '@/hocs';
import { NODE_DRAGGING_CLASSNAME } from '@/pages/Canvas/constants';

export type DraggingNodeProps = {
  position: [number, number];
  isTransform: boolean;
};

const DraggingNode = styled.div.attrs<DraggingNodeProps>(({ isTransform, position: [left, top] }) => ({
  style: isTransform ? { transform: `translate(${left}px, ${top}px)` } : { left, top },
}))<DraggingNodeProps>`
  position: absolute;
  pointer-events: auto;
  will-change: transform;

  &.${NODE_DRAGGING_CLASSNAME} {
    pointer-events: none;
  }
`;

export default DraggingNode;
