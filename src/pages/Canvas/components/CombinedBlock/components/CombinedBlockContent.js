import ButtonContainer from '@/components/Button/components/ButtonContainer';
import { FlexApart } from '@/components/Flex';
import { styled } from '@/hocs';
import { PORT_SIZE } from '@/pages/Canvas/components/Port/components/PortContainer';

const CombinedBlockContent = styled(FlexApart)`
  & ${ButtonContainer} {
    margin-left: ${PORT_SIZE}px;
  }
`;

export default CombinedBlockContent;
