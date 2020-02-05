import Input from '@/componentsV2/Input';
import { css, styled, units } from '@/hocs';

const SearchInput = styled(Input)`
  padding-right: ${units(4.5)}px;

  ${({ searchable, isDropdown }) =>
    !searchable &&
    !isDropdown &&
    css`
      color: #132144 !important;
    `}

  ${({ borderLess }) =>
    borderLess &&
    css`
      border: none !important;
      box-shadow: none !important;
    `}

  ${({ inline }) =>
    inline &&
    css`
      display: inline-block;
    `}
  
  ${({ isDropDownOpened }) =>
    isDropDownOpened &&
    css`
      color: #5d9df5 !important;
    `}

  input {
    width: 100%;
  }

  ${({ withIcon }) =>
    withIcon &&
    css`
      padding-right: ${units(9)}px;
    `}

  &::-webkit-search-cancel-button {
    display: none;
  }
`;

export default SearchInput;
