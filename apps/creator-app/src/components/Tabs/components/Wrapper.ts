import { Flex } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

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
