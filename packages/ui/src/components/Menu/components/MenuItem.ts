import cn from 'classnames';

import { backgrounds, colors, css, styled } from '../../../styles';
import { ClassName } from '../../../styles/constants';
import { flexStyles } from '../../Flex';

export interface MenuItemProps {
  height?: number | string;
  active?: boolean;
  ending?: boolean;
  divider?: boolean;
  disabled?: boolean;
  className?: string;
  capitalize?: boolean;
  bottomAction?: boolean;
}

export const itemStyles = css<MenuItemProps>`
  ${flexStyles}

  height: ${({ theme, height = theme.components.menuItem.height, divider }) => (!divider ? `${height}px` : 0)};
  padding: 0 24px;
  background: ${colors('white')};
  overflow: hidden;
  user-select: none;
  cursor: pointer;
  margin: ${({ divider }) => (divider ? '6px 0' : 'none')};
  border-bottom: ${({ divider }) => (divider ? '1px solid #EAEFF4' : 'none')};

  ${({ disabled }) =>
    disabled &&
    css`
      cursor: default;
      color: ${colors('tertiary')};
      background: ${colors('white')};
    `}

  ${({ capitalize }) =>
    capitalize &&
    css`
      text-transform: capitalize;
    `}

  &:hover {
    ${({ disabled }) =>
      !disabled &&
      css`
        background: linear-gradient(180deg, rgba(238, 244, 246, 0.85) 0%, ${backgrounds('greyGreen')} 100%), ${colors('white')}fff;
      `}
  }

  ${({ active }) =>
    active &&
    css`
      background: linear-gradient(180deg, rgba(238, 244, 246, 0.85) 0%, ${backgrounds('greyGreen')} 100%), ${colors('white')}fff;
    `}

  &:active {
    ${({ disabled }) =>
      !disabled &&
      css`
        background: linear-gradient(180deg, rgba(230, 238, 241, 0.85) 0%, #eaf0f2 100%), ${colors('white')};
      `}
  }

  ${({ bottomAction }) =>
    bottomAction &&
    css`
      color: ${colors('blue')};
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

const MenuItem = styled.li.attrs<MenuItemProps>(({ className }) => ({
  className: cn(className, ClassName.MENU_ITEM),
}))<MenuItemProps>`
  ${itemStyles}
`;

export default MenuItem;
