import Input, { inputFocus } from '@/componentsV2/Input';
import { MenuItem } from '@/componentsV2/Menu';
import { css, styled } from '@/hocs';

export const SelectWrapper = styled.div`
  position: relative;
  min-width: 200px;
  outline: none;
`;

export const SearchInput = styled(Input)`
  ${({ searchable }) =>
    !searchable &&
    css`
      cursor: pointer;
    `}

  ${({ isFocused }) => isFocused && inputFocus}
`;

export const SelectItem = styled(MenuItem)`
  ${({ isFocused }) =>
    isFocused &&
    css`
      background: linear-gradient(180deg, rgba(238, 244, 246, 0.85) 0%, #eef4f6 100%), #ffffff !important;
    `}

  &:hover {
    background: none;
  }

  b {
    text-decoration: underline;
  }
`;

export const MenuPopoverContainer = styled.div`
  z-index: 1100;

  width: ${({ autoWidth }) => !autoWidth && 'auto !important'};
`;

export const MenuHeader = styled.div`
  ${({ isFocused }) =>
    isFocused &&
    css`
      background: linear-gradient(180deg, rgba(238, 244, 246, 0.85) 0%, #eef4f6 100%), #ffffff;

      > input {
        background: linear-gradient(180deg, rgba(238, 244, 246, 0.85) 0%, #eef4f6 100%), #ffffff;
      }
    `}

  display: flex;
  padding: 0 24px;
`;

export const MenuInput = styled(Input)`
  padding: 12px 0;
  flex: 1;
`;

export const MenuHr = styled.hr`
  margin: 0;
`;
