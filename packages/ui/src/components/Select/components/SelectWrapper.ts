import { colors, css, styled } from '../../../styles';
import { inputFocusStyle, InputWrapper } from '../../Input';

export type SelectWrapperProps = {
  minWidth?: boolean;
  clearable?: boolean;
  fullWidth?: boolean;
  isFocused?: boolean;
};

const SelectWrapper = styled.div<SelectWrapperProps>`
  position: relative;
  color: ${colors('primary')};
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
