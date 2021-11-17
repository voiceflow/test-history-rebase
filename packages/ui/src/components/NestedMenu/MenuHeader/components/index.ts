import { css, styled } from '@ui/styles';
import AutosizeInput from 'react-input-autosize';

export { default as MenuHeaderWrapper } from './MenuHeaderWrapper';

interface MenuInputProps {
  inDropdownSearch?: boolean;
}

export const MenuInput = styled(AutosizeInput)<MenuInputProps>`
  padding: 10px 0;
  line-height: 20px;

  input {
    border: none;
    background: transparent;
    padding-right: 0px;
    padding-left: 0px;
  }

  ${({ inDropdownSearch }) =>
    inDropdownSearch &&
    css`
      input {
        cursor: pointer;
      }
    `}

  ::placeholder {
    line-height: 20px;
  }
`;

export const MenuHr = styled.hr`
  margin: 5px 0;
`;

export const SearchContainer = styled.div`
  padding: 0 24px;
  display: flex;
  align-items: center;

  input {
    border: none !important;
    background: transparent;
    box-shadow: none;
    padding-right: 0px;
    padding-left: 0px;
  }
`;
