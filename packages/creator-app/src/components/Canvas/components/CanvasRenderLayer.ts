import { styled } from '@/hocs/styled';

interface Size {
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
}

const CanvasRenderLayer = styled.div<{ size: Size }>`
  position: absolute;
  height: ${({ size }) => size.height}px;
  width: ${({ size }) => size.width}px;
  transform-origin: ${({ size }) => size.offsetX}px ${({ size }) => size.offsetY}px;
  pointer-events: none;
  will-change: transform;
`;

export default CanvasRenderLayer;
