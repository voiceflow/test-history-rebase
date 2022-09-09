import Menu from '@ui/components/Menu';
import { css, styled } from '@ui/styles';

interface SelectItemProps {
  isGroup?: boolean;
  isNested?: boolean;
  withSubLevel?: boolean;
}

const SelectItem = styled(Menu.Item)<SelectItemProps>`
  position: relative;

  &:hover {
    background: none;
  }

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

  b {
    text-decoration: underline;
  }
`;

export default SelectItem;
