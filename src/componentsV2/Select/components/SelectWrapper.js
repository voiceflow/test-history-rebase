import InputWrapper from '@/componentsV2/Input/components/InputWrapper';
import { inputFocus } from '@/componentsV2/Input/styles';
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

  ${InputWrapper} {
    ${({ isFocused }) => isFocused && inputFocus}
  }
`;

export default SelectWrapper;
