import { css, styled } from '@/hocs';

const NodeContainer = styled.div`
  position: absolute;
  box-sizing: content-box;
  pointer-events: auto;
  backface-visibility: hidden;

  ${({ position: [left, top] }) => css`
    transform: translate3d(${left}px, ${top}px, 0);
  `}

  ${({ isActive }) =>
    isActive &&
    css`
      z-index: 10;
    `}

  ${({ isDragging }) =>
    isDragging &&
    css`
      pointer-events: none;
    `}

  &:focus {
    outline: 0;
  }

  &:focus,
  &:focus-within {
    z-index: 20;
  }
`;

export default NodeContainer;
