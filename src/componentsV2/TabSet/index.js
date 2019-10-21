import styled from 'styled-components';

import { FlexCenter } from '@/componentsV2/Flex';
import * as Tab from '@/componentsV2/Tab';

const TabSet = styled(FlexCenter)`
  height: 100%;

  & ${Tab.Container} {
    height: 100%;
  }
`;

export default TabSet;
