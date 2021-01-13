import InputWrapper from '@/components/Input/components/InputWrapper';
import { inputFocus } from '@/components/Input/styles';
import { css, styled } from '@/hocs';

export type SelectWrapperProps = {
  minWidth?: boolean;
  clearable?: boolean;
  fullWidth?: boolean;
  isFocused?: boolean;
};

const SelectWrapper = styled.div<SelectWrapperProps>`
  position: relative;
  outline: none;
  color: #132144;

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
    ${({ isFocused }) => isFocused && inputFocus}
  }
`;

export default SelectWrapper;
