import AutosizeInput from 'react-input-autosize';

import Flex from '@/components/Flex';
import { css, styled } from '@/styles';

export { default as MenuHeaderWrapper } from './MenuHeaderWrapper';

interface MenuInputProps {
  $fullWidth?: boolean;
}

export const MenuInput = styled(AutosizeInput)<MenuInputProps>`
  padding: 10px 0;
  line-height: 20px;
  flex: 100;

  input {
    border: none;
    background: transparent;
    padding-right: 0px;
    padding-left: 0px;
  }

  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      input {
        width: 100% !important;
      }
    `}

  ::placeholder {
    line-height: 20px;
  }
`;

export const MenuHr = styled.hr`
  margin: 5px 0;
`;

export const SearchContainer = styled(Flex)`
  padding: 0 24px;

  input {
    border: none !important;
    background: transparent;
    box-shadow: none;
    padding-right: 0px;
    padding-left: 0px;
  }
`;
