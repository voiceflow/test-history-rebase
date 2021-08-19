import AutosizeInput from 'react-input-autosize';

import { css, styled } from '../../../../styles';

export { default as MenuHeaderWrapper } from './MenuHeaderWrapper';

export const MenuInput = styled(AutosizeInput)`
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
    padding-right: 0px;
    padding-left: 0px;
  }
`;
