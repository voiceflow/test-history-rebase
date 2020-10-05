import Input from '@/components/Input';
import { css, styled } from '@/hocs';

export type SearchInputProps = {
  opened?: boolean;
  inline?: boolean;
  clearable?: boolean;
  searchable?: boolean;
  isDropdown?: boolean;
  borderLess?: boolean;
  isDropDownOpened?: boolean;
};

const SearchInput = styled(Input)<SearchInputProps>`
  padding-right: 34px;
  height: ${({ theme }) => theme.components.input.height}px;

  ${({ searchable, isDropdown }) =>
    (!searchable || isDropdown) &&
    css`
      &[disabled] {
        color: #132144;
      }
    `}

  ${({ borderLess }) =>
    borderLess &&
    css`
      border: none !important;
      box-shadow: none !important;
    `}

  ${({ clearable }) =>
    !!clearable &&
    css`
      pointer-events: none;
    `}

  ${({ inline }) =>
    inline &&
    css`
      display: inline-block;
    `}

  ${({ isDropDownOpened, opened }) =>
    (isDropDownOpened || opened) &&
    css`
      border-color: #5d9df5 !important;

      ${isDropDownOpened &&
      css`
        &[disabled] {
          color: #5d9df5 !important;
        }
      `}
    `}

  input {
    width: 100%;
  }

  &::-webkit-search-cancel-button,
  input::-webkit-search-cancel-button {
    display: none;
  }
`;

export default SearchInput;
