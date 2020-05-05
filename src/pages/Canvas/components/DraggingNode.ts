import { css, styled } from '@/hocs';

export type DraggingNodeProps = {
  position: [number, number];
  isDragging: boolean;
};

const DraggingNode = styled.div.attrs<DraggingNodeProps>(({ position: [left, top] }) => ({
  style: {
    transform: `translate(${left}px, ${top}px)`,
  },
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
