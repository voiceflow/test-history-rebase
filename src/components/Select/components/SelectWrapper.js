import InputWrapper from '@/components/Input/components/InputWrapper';
import { inputFocus } from '@/components/Input/styles';
import { css, styled } from '@/hocs';

const SelectWrapper = styled.div`
  position: relative;
  outline: none;
  cursor: pointer;
  color: #132144;

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
