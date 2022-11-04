import { inputFocusStyle, InputWrapper } from '@ui/components/Input';
import { colors, css, styled, ThemeColor } from '@ui/styles';

export interface SelectWrapperProps {
  minWidth?: boolean;
  fullWidth?: boolean;
  isFocused?: boolean;
  withClearIcon?: boolean;
  width?: string;
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

  ${({ minWidth, width }) =>
    minWidth &&
    !width &&
    css`
      min-width: 200px;
    `}

  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}

  ${({ withClearIcon }) =>
    withClearIcon &&
    css`
      cursor: not-allowed;
    `}

  ${({ width }) =>
    width &&
    css`
      width: ${width};
    `}

  ${InputWrapper} {
    ${({ isFocused }) => isFocused && inputFocusStyle}
  }
`;

export default SelectWrapper;
