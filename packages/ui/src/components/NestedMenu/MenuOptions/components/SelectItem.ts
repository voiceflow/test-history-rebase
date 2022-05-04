import { MenuItem } from '@ui/components/Menu';
import { backgrounds, colors, css, styled, ThemeColor } from '@ui/styles';

interface SelectItemProps {
  isFocused?: boolean;
  isGroup?: boolean;
  isNested?: boolean;
  withSubLevel?: boolean;
}

const SelectItem = styled(MenuItem)<SelectItemProps>`
  position: relative;

  ${({ isFocused }) =>
    isFocused &&
    css`
      background: linear-gradient(180deg, rgba(238, 244, 246, 0.85) 0%, ${backgrounds('greyGreen')} 100%), ${colors(ThemeColor.WHITE)} !important;
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

  &:hover {
    background: none;
  }

  b {
    text-decoration: underline;
  }
`;

export default SelectItem;
