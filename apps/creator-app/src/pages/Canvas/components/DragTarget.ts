import { css, styled } from '@/hocs/styled';
import type { Point } from '@/types';

export interface DragTargetProps {
  position: Point;
  isTransform?: boolean;
  zIndex?: number;
}

const DragTarget = styled.div.attrs<DragTargetProps>(({ isTransform, position: [left, top] }) => ({
  style: isTransform ? { transform: `translate(${left}px, ${top}px)` } : { left, top },
}))<DragTargetProps>`
  position: absolute;
  pointer-events: auto;

  ${({ zIndex }) =>
    zIndex &&
    css`
      z-index: ${zIndex};
    `}
`;

export default DragTarget;
