import { FlexApart } from '@/components/Flex';
import { styled } from '@/hocs';

import { PORT_SIZE } from './PortContainer';

const PortLabel = styled(FlexApart)`
  height: ${PORT_SIZE}px;
  margin: 0 12px;
  font-size: 14px;
  color: #132144;
`;

export default PortLabel;
