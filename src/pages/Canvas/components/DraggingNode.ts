import { css, styled } from '@/hocs';

export type DraggingNodeProps = {
  position: [number, number];
  isDragging: boolean;
  isTransform: boolean;
};

const DraggingNode = styled.div.attrs<DraggingNodeProps>(({ isTransform, position: [left, top] }) => ({
  style: isTransform ? { transform: `translate(${left}px, ${top}px)` } : { left, top },
}))<DraggingNodeProps>`
  position: absolute;
  pointer-events: auto;
  will-change: transform;

  ${({ isDragging }) =>
    isDragging &&
    css`
      pointer-events: none;
    `}
`;

export default DraggingNode;
