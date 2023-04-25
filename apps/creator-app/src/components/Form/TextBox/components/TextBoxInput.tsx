import React from 'react';
import Textarea, { TextareaAutosizeProps } from 'react-textarea-autosize';

import { inputControlStyles } from '@/components/Form/styles';
import { css, styled } from '@/hocs/styled';

export interface TextBoxInputProps extends Omit<TextareaAutosizeProps, 'ref'> {
  errorBound?: boolean;
}

const TextBoxInput = styled(({ errorBound, ...rest }: TextBoxInputProps) => <Textarea {...rest} />)`
  ${inputControlStyles};

  ${({ errorBound }) =>
    errorBound &&
    css`
      border-color: #bd425f;
    `};
`;

export default TextBoxInput;
