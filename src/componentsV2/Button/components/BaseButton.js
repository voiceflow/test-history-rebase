import styled from 'styled-components';

import { flexCenterStyles } from '@/componentsV2/Flex';

import { clickableStyles } from '../styles';

const BaseButton = styled.button`
  ${flexCenterStyles}
  ${clickableStyles}

  padding: 0;
  border: 0;
  background: inherit;

  &:focus,
  &:active {
    outline: 0;
  }
`;

export default BaseButton;
