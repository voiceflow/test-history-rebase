import styled, { css } from 'styled-components';

import { inputControlStyles } from '@/componentsV2/form/styles';

const InputComponent = styled.input`
  ${inputControlStyles};

  ${({ errorBound }) =>
    errorBound &&
    css`
      border: 1px solid #e91e63;
    `};
`;

export default InputComponent;
