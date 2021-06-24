import { Flex, SvgIconContainer } from '@voiceflow/ui';
import styled from 'styled-components';

const SecondaryDropdownButtonToggle = styled(Flex)`
  margin-right: -2px;
  margin-left: 12px;

  & ${SvgIconContainer} {
    color: #6e849a;
  }
`;

export default SecondaryDropdownButtonToggle;
