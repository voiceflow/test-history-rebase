import styled from 'styled-components';

import Flex from '@/componentsV2/Flex';

const InlineFormControl = styled(Flex)`
  padding: ${({ theme }) => theme.unit * 2}px 0;

  & > * {
    margin: 0 ${({ theme }) => theme.unit}px;
  }

  & > :last-child {
    margin-right: 0;
  }

  & > :first-child {
    margin-left: 0;
  }
`;

export default InlineFormControl;
