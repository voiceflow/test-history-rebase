import ButtonContainer from '@/componentsV2/Button/components/ButtonContainer';
import { FlexApart } from '@/componentsV2/Flex';
import { PORT_SIZE } from '@/containers/CanvasV2/components/Port/components/PortContainer';
import { styled } from '@/hocs';

const CombinedBlockContent = styled(FlexApart)`
  & ${ButtonContainer} {
    margin-left: ${PORT_SIZE}px;
  }
`;

export default CombinedBlockContent;
