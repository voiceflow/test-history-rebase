import styled from 'styled-components';

import { FlexCenter } from '@/components/Flex';

const InnerContainer = styled(FlexCenter)`
  height: ${({ theme }) => theme.components.input.height}px;
  padding: 0 16px;
`;

export default InnerContainer;
