import styled from 'styled-components';

import Flex from '@/componentsV2/Flex';

import Tab from './Tab';

const TabWrapper = styled(Flex)`
  position: relative;
  height: 100%;
  justify-content: flex-start;

  & ${Tab} {
    height: 100%;
  }
`;

export default TabWrapper;
