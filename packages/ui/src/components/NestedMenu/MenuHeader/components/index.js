import AutosizeInput from 'react-input-autosize';

import { styled } from '../../../../styles';

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

  ::placeholder {
    line-height: 20px;
  }
`;

export const MenuHr = styled.hr`
  margin: 0;
`;
