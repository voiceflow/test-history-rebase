import cn from 'classnames';

import { flexStyles } from '@/components/Flex';
import { colors, css, styled, ThemeColor, transition } from '@/styles';
import { ClassName } from '@/styles/constants';

import ItemActionIcon from './ItemActionIcon';
import ItemIcon from './ItemIcon';
import ItemNextIcon from './ItemNextIcon';

export interface ItemProps {
  style?: React.CSSProperties;
  height?: number | string;
  active?: boolean;
  ending?: boolean;
  divider?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  className?: string;
  capitalize?: boolean;
  bottomAction?: boolean;
}

export const activeStyles = css`
  background: #eef4f6;

  &:hover {
    background: #eef4f6;
  }

  ${ItemIcon} {
    opacity: 1;
  }

  ${ItemNextIcon} {
    transform: translateX(8px);
    opacity: 1;
  }

  ${ItemActionIcon} {
    opacity: 0.85;
    display: block;

    &:hover {
      opacity: 1;
    }
  }
`;

export const itemStyles = css<ItemProps>`
  ${flexStyles}
  ${transition('background')}

  height: ${({ theme, height = theme.components.menuItem.height, divider }) => (!divider ? `${height}px` : 0)};
  padding: 0 24px;
  background: ${colors(ThemeColor.WHITE)};
  overflow: hidden;
  user-select: none;
  cursor: pointer;
  margin: ${({ divider }) => (divider ? '8px 0' : '0')};
  border-bottom: ${({ divider }) => (divider ? '1px solid #EAEFF4' : 'none')};

  ${({ readOnly, disabled = readOnly }) =>
    disabled &&
    css`
      cursor: ${readOnly ? 'text' : 'not-allowed'};
      color: rgba(19, 33, 68, 0.65);
      background: ${colors(ThemeColor.WHITE)};
    `}

  ${({ divider }) =>
    divider &&
    css`
      pointer-events: none;
    `}

  ${({ capitalize }) =>
    capitalize &&
    css`
      text-transform: capitalize;
    `}

  ${ItemIcon} {
    opacity: 0.85;
  }

  ${ItemNextIcon} {
    opacity: 0.65;
  }

  ${ItemActionIcon} {
    display: none;
  }

  &:hover {
    ${({ readOnly, disabled = readOnly }) => !disabled && activeStyles}
  }

  ${({ active }) => active && activeStyles}

  &:active {
    ${({ readOnly, disabled = readOnly }) => !disabled && activeStyles}
  }

  ${({ bottomAction }) =>
    bottomAction &&
    css`
      color: ${colors(ThemeColor.BLUE)};
      padding: 24px 46px;
      justify-content: center;
    `}

  ${({ ending, height = 52 }) =>
    ending &&
    css`
      height: ${height}px;
      background: #fbfbfb !important;
      padding-bottom: 2px;
    `}
`;

const StyledItem = styled.li.attrs<ItemProps>(({ className }) => ({
  className: cn(className, ClassName.MENU_ITEM),
}))<ItemProps>`
  ${itemStyles}
`;

export default Object.assign(StyledItem, { activeStyles });
