import ButtonContainer from '@/componentsV2/Button/components/ButtonContainer';
import { FlexApart } from '@/componentsV2/Flex';
import { styled } from '@/hocs';
import { PORT_SIZE } from '@/pages/Canvas/components/Port/components/PortContainer';

const CombinedBlockContent = styled(FlexApart)`
  & ${ButtonContainer} {
    margin-left: ${PORT_SIZE}px;
  }
`;

export default CombinedBlockContent;
