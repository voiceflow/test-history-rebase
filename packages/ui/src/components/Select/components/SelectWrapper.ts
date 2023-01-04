import { inputFocusStyle, InputWrapper } from '@ui/components/Input';
import SearchInput from '@ui/components/SearchInput';
import { colors, css, styled, ThemeColor } from '@ui/styles';

export interface SelectWrapperProps {
  width?: string;
  minWidth?: boolean;
  maxWidth?: string | number;
  fullWidth?: boolean;
  isFocused?: boolean;
  withClearIcon?: boolean;
}

const SelectWrapper = styled.div<SelectWrapperProps>`
  position: relative;
  color: ${colors(ThemeColor.PRIMARY)};
  outline: none;

  ${({ onClick, onFocus }) =>
    !!(onClick || onFocus) &&
    css`
      cursor: pointer;

      ${SearchInput}[readOnly] {
        cursor: pointer;
      }
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

    ${({ maxWidth }) =>
    maxWidth &&
    css`
      max-width: ${typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth};
    `}

  ${InputWrapper} {
    ${({ isFocused }) => isFocused && inputFocusStyle}
  }
`;

export default SelectWrapper;
