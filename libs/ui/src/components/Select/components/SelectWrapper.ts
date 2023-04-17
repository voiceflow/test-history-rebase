import { inputFocusStyle, InputWrapper } from '@ui/components/Input';
import SearchInput, { SearchInputIcon } from '@ui/components/SearchInput';
import { colors, css, styled, ThemeColor, transition } from '@ui/styles';

export interface SelectWrapperProps {
  width?: string;
  minWidth?: boolean | string;
  maxWidth?: string | number;
  fullWidth?: boolean;
  isFocused?: boolean;
  withClearIcon?: boolean;
}

const SelectWrapper = styled.div<SelectWrapperProps>`
  position: relative;
  color: ${colors(ThemeColor.PRIMARY)};
  outline: none;

  ${SearchInputIcon} {
    opacity: 0.85;
    transition: ${transition('opacity')};
  }

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
      min-width: ${typeof minWidth === 'boolean' ? `200px` : minWidth};
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

  &:hover {
    ${SearchInputIcon} {
      opacity: 1;
    }
  }
`;

export default SelectWrapper;
