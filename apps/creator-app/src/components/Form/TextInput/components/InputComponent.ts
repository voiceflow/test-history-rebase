import { fontResetStyle } from '@voiceflow/ui';
import styled, { css } from 'styled-components';

import { inputControlStyles } from '@/components/Form/styles';

export interface InputComponentProps extends React.ComponentProps<'input'> {
  errorBound?: boolean;
}

const InputComponent = styled.input<InputComponentProps>`
  ${inputControlStyles};
  ${fontResetStyle};

  ${({ errorBound }) =>
    errorBound &&
    css`
      border: 1px solid #bd425f;
    `};
`;

export default InputComponent;
