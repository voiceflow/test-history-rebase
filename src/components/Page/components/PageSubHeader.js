import styled from 'styled-components';

import { FlexApart } from '@/componentsV2/Flex';

const PageSubHeader = styled(FlexApart)`
  box-sizing: border-box;
  height: 50px;
  border-top: 1px solid #dfe3ed;
  padding: 0 40px;

  background: ${({ theme }) => theme.color.background};
`;

export default PageSubHeader;
