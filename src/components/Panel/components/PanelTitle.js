import Flex from '@/componentsV2/Flex';
import { styled } from '@/hocs';

const PanelTitle = styled(Flex)`
  height: ${({ theme }) => theme.unit * 7}px;
  border: 0;
  font-size: 22px;
  font-weight: 600;
  color: #132144;
`;

export default PanelTitle;
