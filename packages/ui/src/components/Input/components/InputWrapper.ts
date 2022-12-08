import Badge from '@ui/components/Badge';
import { inputDisabledStyle, inputStyle, StyledInputProps } from '@ui/components/Input/styles';
import { css, styled } from '@ui/styles';

export interface InputWrapperProps extends StyledInputProps {
  cursor?: string;
  readOnly?: boolean;
  disabled?: boolean;
  pointerEvents?: string;
  disabledBorderColor?: string;
  counter?: boolean;
}

const InputWrapper = styled.div<InputWrapperProps>`
  ${inputStyle}
  position: relative;
  display: flex;
  align-items: center;

  ${({ readOnly }) =>
    readOnly &&
    css`
      cursor: default;
    `}

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

  ${({ counter }) =>
    counter
      ? css`
          border: 1px solid #d2dae2;
          &:active,
          &:focus,
          &:focus-within {
            border: 1px solid #d2dae2;
          }
        `
      : css`
          & > * {
            margin-right: 12px;
            :last-child {
              margin-right: 0;
            }
          }
        `};

  & > ${Badge}:last-child {
    margin-right: -6px;
  }
`;

export default InputWrapper;
