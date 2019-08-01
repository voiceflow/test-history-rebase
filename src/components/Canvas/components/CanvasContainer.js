import { styled } from '@/hocs';

const CanvasContainer = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  cursor: grab;
  user-select: none;

  &:active {
    cursor: grabbing;
  }
`;

export default CanvasContainer;
