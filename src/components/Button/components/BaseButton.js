import { flexCenterStyles } from '@/components/Flex';
import { css, styled } from '@/hocs';

import { clickableStyles } from '../styles';

export const baseButtonStyles = css`
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

const BaseButton = styled.button`
  ${baseButtonStyles}
`;

export default BaseButton;
