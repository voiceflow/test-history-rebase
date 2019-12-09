import styled from 'styled-components';

import { SvgIconContainer } from '@/components/SvgIcon';
import Flex from '@/componentsV2/Flex';

const PrimaryDropdownButtonToggle = styled(Flex)`
  padding: 14px 18px 18px 14px;

  & ${SvgIconContainer} {
    color: #fff;
  }
`;

export default PrimaryDropdownButtonToggle;
