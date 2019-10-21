import { FlexCenter } from '@/componentsV2/Flex';
import { PORT_SIZE } from '@/containers/CanvasV2/components/Port/components/PortContainer';
import { styled } from '@/hocs';

const FlowBlockContainer = styled(FlexCenter)`
  position: relative;
  width: 100%;
  height: ${PORT_SIZE}px;
  margin: 2px 0 12px;
`;

export default FlowBlockContainer;
