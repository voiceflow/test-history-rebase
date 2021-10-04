import { backgrounds, colors, css, styled, ThemeColor } from '../../../styles';
import { MenuItem } from '../../Menu';

export interface SelectItemProps {
  isGroup?: boolean;
  isNested?: boolean;
  isFocused?: boolean;
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
      font-weight: bold;
      cursor: default;
    `}

  ${({ isNested }) =>
    isNested &&
    css`
      padding-left: 36px;
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
