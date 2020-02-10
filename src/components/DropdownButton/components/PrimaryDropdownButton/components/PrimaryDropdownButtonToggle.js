import styled from 'styled-components';

import Flex from '@/components/Flex';
import { SvgIconContainer } from '@/components/SvgIcon';

const PrimaryDropdownButtonToggle = styled(Flex)`
  padding: 14px 18px 18px 14px;

  & ${SvgIconContainer} {
    color: #fff;
  }
`;

export default PrimaryDropdownButtonToggle;
