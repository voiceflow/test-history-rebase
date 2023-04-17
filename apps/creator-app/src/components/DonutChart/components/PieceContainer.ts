import { styled } from '@/hocs/styled';

interface PieceContainerProps {
  rotate: number;
}

const PieceContainer = styled.div<PieceContainerProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transform: rotate(${({ rotate }) => 180 + rotate}deg);
  transform-origin: right;
  pointer-events: none;
`;

export default PieceContainer;
