import styled from 'styled-components';

import Flex from '@/components/Flex';
import * as SvgIcon from '@/components/SvgIcon';

const SecondaryDropdownButtonToggle = styled(Flex)`
  margin-left: 12px;
  margin-right: -2px;

  & ${SvgIcon.Container} {
    color: #6e849a;
  }
`;

export default SecondaryDropdownButtonToggle;
