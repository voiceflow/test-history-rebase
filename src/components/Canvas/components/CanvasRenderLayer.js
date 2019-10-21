import { styled } from '@/hocs';

const CanvasRenderLayer = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  transform-origin: 0 0;
  pointer-events: none;
  backface-visibility: hidden;
  perspective: 1000;
`;

export default CanvasRenderLayer;
