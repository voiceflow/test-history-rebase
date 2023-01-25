import Input from '@ui/components/Input';
import { colors, css, styled, ThemeColor } from '@ui/styles';

export * from './components';

export interface SearchInputProps {
  opened?: boolean;
  inline?: boolean;
  ellipsis?: boolean;
  searchable?: boolean;
  isDropdown?: boolean;
  borderLess?: boolean;
  isSecondary?: boolean;
  withLeftIcon?: boolean;
  withRightIcon?: boolean;
  withClearIcon?: boolean;
  isDropDownOpened?: boolean;
}

const SearchInput = styled(Input)<SearchInputProps>`
  height: ${({ theme }) => theme.components.input.height}px;

  ${({ color }) =>
    color &&
    css`
      color: ${color} !important;
    `};

  ${({ withLeftIcon }) =>
    withLeftIcon &&
    css`
      padding-left: 44px;
    `}

  ${({ withRightIcon }) =>
    withRightIcon &&
    css`
      padding-right: 34px;
    `}

  ${({ ellipsis }) =>
    ellipsis &&
    css`
      text-overflow: ellipsis;
    `}

  ${({ isSecondary }) =>
    isSecondary &&
    css`
      font-size: 13px;
      color: #62778c;
      font-weight: 600;
      text-transform: uppercase;
    `}

  ${({ searchable, isDropdown }) =>
    (!searchable || isDropdown) &&
    css`
      &[disabled] {
        color: #132144;
      }
    `}

  ${({ isSecondary }) =>
    isSecondary &&
    css`
      font-size: 13px;
      color: #62778c;
      font-weight: 600;
      text-transform: uppercase;

      &[disabled] {
        color: #62778c;
        opacity: 0.85;
        pointer-events: none;
      }
    `}

  ${({ borderLess }) =>
    borderLess &&
    css`
      border: none !important;
      box-shadow: none !important;
    `}

  ${({ withClearIcon }) =>
    !!withClearIcon &&
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
      border-color: ${colors(ThemeColor.BLUE)} !important;
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
