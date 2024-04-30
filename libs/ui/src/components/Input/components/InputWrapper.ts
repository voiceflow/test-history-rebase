import Badge from '@/components/Badge';
import type { StyledInputProps } from '@/components/Input/styles';
import { inputDisabledStyle, inputStyle } from '@/components/Input/styles';
import { css, styled } from '@/styles';

export interface InputWrapperProps extends StyledInputProps {
  cursor?: string;
  counter?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  pointerEvents?: string;
  disabledBorderColor?: string;
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
          border-radius: 8px;
          padding: 0;
          max-width: fit-content;

          &:active,
          &:focus,
          &:focus-within {
            border: 1px solid #d2dae2;
          }

          input {
            text-align: center;
            max-width: min-content;
            min-width: 24px;
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
