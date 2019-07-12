import styled from 'styled-components';

import { FlexCenter } from '@/componentsV2/Flex';

import Tab from './components/Tab';

export { Tab };

const TabSet = styled(FlexCenter)`
  height: 100%;

  & ${Tab} {
    height: 100%;
  }
`;

export default TabSet;
