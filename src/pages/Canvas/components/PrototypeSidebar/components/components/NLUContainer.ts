import { FlexCenter } from '@/components/Flex';
import Text from '@/components/Text';
import { styled } from '@/hocs';

const NLUContainer = styled(FlexCenter).attrs({ column: true })`
  height: 100%;
  ${Text} {
    text-align: center;
    white-space: pre-line;
    min-width: 270px;
    max-width: 270px;
  }
`;

export default NLUContainer;
