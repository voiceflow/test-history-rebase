import styled, { css } from 'styled-components';

import Flex from '@/componentsV2/Flex';

const DropdownButton = styled(Flex)`
  font-size: 15px;
  line-height: 18px;
  color: #8da2b5;
  flex: 1;

  & > span {
    color: #132042;
  }

  ${({ multiSelect }) =>
    multiSelect &&
    css`
      line-height: 15px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      padding-right: 10px;
    `}
`;

export default DropdownButton;
