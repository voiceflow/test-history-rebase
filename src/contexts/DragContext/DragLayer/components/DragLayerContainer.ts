import { styled } from '@/hocs/styled';

const DragLayerContainer = styled.div`
  position: fixed;
  pointer-events: none;
  z-index: 2000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  content-visibility: auto;
`;

export default DragLayerContainer;
