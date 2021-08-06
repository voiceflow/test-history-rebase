import { colors, css, styled } from '../../styles';
import Input from '../Input';

export * from './components';

export interface SearchInputProps {
  opened?: boolean;
  inline?: boolean;
  clearable?: boolean;
  searchable?: boolean;
  isDropdown?: boolean;
  borderLess?: boolean;
  isDropDownOpened?: boolean;
}

const SearchInput = styled(Input)<SearchInputProps>`
  height: ${({ theme }) => theme.components.input.height}px;
  padding-right: 34px;

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
      border-color: ${colors('blue')} !important;

      ${isDropDownOpened &&
      css`
        &[disabled] {
          color: ${colors('blue')} !important;
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
