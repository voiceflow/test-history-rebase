import styled from 'styled-components';

import Flex from '@/components/Flex';
import { SvgIconContainer } from '@/components/SvgIcon';

const SecondaryDropdownButtonToggle = styled(Flex)`
  margin-left: 12px;
  margin-right: -2px;

  & ${SvgIconContainer} {
    color: #6e849a;
  }
`;

export default SecondaryDropdownButtonToggle;
