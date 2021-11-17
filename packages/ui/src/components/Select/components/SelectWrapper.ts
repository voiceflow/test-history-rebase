import { inputFocusStyle, InputWrapper } from '@ui/components/Input';
import { colors, css, styled, ThemeColor } from '@ui/styles';

export interface SelectWrapperProps {
  minWidth?: boolean;
  clearable?: boolean;
  fullWidth?: boolean;
  isFocused?: boolean;
}

const SelectWrapper = styled.div<SelectWrapperProps>`
  position: relative;
  color: ${colors(ThemeColor.PRIMARY)};
  outline: none;

  ${({ onClick, onFocus }) =>
    !!(onClick || onFocus) &&
    css`
      cursor: pointer;
    `};

  ${({ minWidth }) =>
    minWidth &&
    css`
      min-width: 200px;
    `}

  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}

  ${({ clearable }) =>
    clearable &&
    css`
      cursor: not-allowed;
    `}

  ${InputWrapper} {
    ${({ isFocused }) => isFocused && inputFocusStyle}
  }
`;

export default SelectWrapper;
