import Badge from '@ui/components/Badge';
import { inputDisabledStyle, inputStyle, StyledInputProps } from '@ui/components/Input/styles';
import { css, styled } from '@ui/styles';

export type InputWrapperProps = StyledInputProps & {
  disabled?: boolean;
  disabledBorderColor?: string;
  pointerEvents?: string;
  cursor?: string;
};

const InputWrapper = styled.div<InputWrapperProps>`
  ${inputStyle}
  position: relative;
  display: flex;
  align-items: center;

  &[disabled] {
    ${inputDisabledStyle}
    input {
      ${inputDisabledStyle}
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
