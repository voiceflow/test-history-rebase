import styled from 'styled-components';

import { SvgIconContainer } from '@/components/SvgIcon';
import Flex from '@/componentsV2/Flex';

const PrimaryDropdownButtonToggle = styled(Flex)`
  padding: 0 16px 0 12px;

  & ${SvgIconContainer} {
    color: #fff;
  }
`;

export default PrimaryDropdownButtonToggle;
