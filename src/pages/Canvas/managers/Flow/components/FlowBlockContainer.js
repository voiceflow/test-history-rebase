import { FlexCenter } from '@/componentsV2/Flex';
import { styled } from '@/hocs';
import { PORT_SIZE } from '@/pages/Canvas/components/Port/components/PortContainer';

const FlowBlockContainer = styled(FlexCenter)`
  position: relative;
  width: 100%;
  height: ${PORT_SIZE}px;
  margin: 2px 0 12px;
`;

export default FlowBlockContainer;
