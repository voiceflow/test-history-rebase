import styled from 'styled-components';

import { SvgIconContainer } from '@/components/SvgIcon';
import Flex from '@/componentsV2/Flex';

const SecondaryDropdownButtonToggle = styled(Flex)`
  margin-left: 12px;
  margin-right: -2px;

  & ${SvgIconContainer} {
    color: #6e849a;
  }
`;

export default SecondaryDropdownButtonToggle;
