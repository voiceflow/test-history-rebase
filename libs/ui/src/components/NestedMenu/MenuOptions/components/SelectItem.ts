import Menu from '@/components/Menu';
import { css, styled } from '@/styles';

interface SelectItemProps {
  isGroup?: boolean;
  isNested?: boolean;
  isEmpty?: boolean;
  searchable?: boolean;
  withSubLevel?: boolean;
}

const SelectItem = styled(Menu.Item)<SelectItemProps>`
  position: relative;

  &:hover {
    background: none;
  }

  ${({ isEmpty }) =>
    isEmpty &&
    css`
      height: fit-content;
    `}

  ${({ isGroup }) =>
    isGroup &&
    css`
      font-weight: 600;
      cursor: default;
    `}

  ${({ isNested }) =>
    isNested &&
    css`
      padding-left: 24px;
    `}

  ${({ withSubLevel }) =>
    withSubLevel &&
    css`
      padding-right: 80px;
    `}

  ${({ searchable }) =>
    searchable &&
    css`
      b {
        text-decoration: underline;
      }
    `}
`;

export default SelectItem;
