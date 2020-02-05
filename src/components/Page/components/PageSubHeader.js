import styled from 'styled-components';

import { FlexApart } from '@/componentsV2/Flex';

const PageSubHeader = styled(FlexApart)`
  box-sizing: border-box;
  height: 50px;
  border-top: 1px solid #dfe3ed;
  background: ${({ theme }) => theme.color.background};
  background-color: #fff;
  background-image: linear-gradient(-180deg, rgba(246, 246, 246, 0.5) 0%, rgba(246, 246, 246, 0.65) 100%);
  padding: 0 30px 0px 40px;
`;

export default PageSubHeader;
