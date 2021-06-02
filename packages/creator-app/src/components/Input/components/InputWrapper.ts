import Badge from '@/components/Badge';
import { css, styled } from '@/hocs';

import { inputDisabled, inputStyle, StyledInputProps } from '../styles';

export type InputWrapperProps = StyledInputProps & {
  disabled?: boolean;
  disabledBorderColor?: string;
  pointerEvents?: string;
  cursor?: string;
};

const InputWrapper = styled.div<InputWrapperProps>`
  ${inputStyle}

  display: flex;
  align-items: center;
  position: relative;

  &[disabled] {
    ${inputDisabled}
    input {
      ${inputDisabled}
    }

    ${({ disabledBorderColor }) =>
      disabledBorderColor &&
      css`
        border: solid 1px ${disabledBorderColor};
      `}
  }

  & > * {
    margin-right: 12px;
    :last-child {
      margin-right: 0;
    }
  }

  & > ${Badge}:last-child {
    margin-right: -6px;
  }
`;

export default InputWrapper;
