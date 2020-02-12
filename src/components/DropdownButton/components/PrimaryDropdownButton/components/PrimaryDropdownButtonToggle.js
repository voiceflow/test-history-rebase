import styled from 'styled-components';

import Flex from '@/components/Flex';
import * as SvgIcon from '@/components/SvgIcon';

const PrimaryDropdownButtonToggle = styled(Flex)`
  padding: 14px 18px 18px 14px;

  & ${SvgIcon.Container} {
    color: #fff;
  }
`;

export default PrimaryDropdownButtonToggle;
