import React from 'react';
import Textarea from 'react-textarea-autosize';
import styled, { css } from 'styled-components';

import { inputControlStyles } from '@/componentsV2/form/styles';

const TextBoxInput = styled(({ errorBound, ...rest }) => <Textarea {...rest} />)`
  ${inputControlStyles};

  ${({ errorBound }) =>
    errorBound
      ? css`
          border-color: #e91e63;
        `
      : ''};
`;

export default TextBoxInput;
