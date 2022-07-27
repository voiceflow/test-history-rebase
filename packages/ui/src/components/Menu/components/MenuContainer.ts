import { cardStyles } from '@ui/components/Card';
import { colors, css, styled, ThemeColor } from '@ui/styles';
import { SlideDown } from '@ui/styles/animations';

export const MAX_VISIBLE_ITEMS = 7.5;
export const MAX_MENU_HEIGHT = '90vh';
export const VERTICAL_PADDING = 8;

const nativeScrollbarsStyle = css`
  .scrollbars > div {
    overflow: auto !important;
  }
`;

export const getItemsContainer = (itemHeight: number, maxVisibleItems: number = MAX_VISIBLE_ITEMS): number => itemHeight * maxVisibleItems;

export const getMaxHeight = (
  maxHeight: string | number | undefined,
  maxVisibleItems: number | undefined,
  menuItemHeight: number,
  countPadding?: boolean
): string | number => {
  if (maxHeight) return maxHeight;

  if (maxVisibleItems) {
    const itemsContainer = getItemsContainer(menuItemHeight, maxVisibleItems);
    return countPadding ? `${itemsContainer + VERTICAL_PADDING * 2}px` : `${itemsContainer}px`;
  }

  return MAX_MENU_HEIGHT;
};

export interface MenuContainerProps {
  fullWidth?: boolean;
  nativeScrollbar?: boolean;
  noTopPadding?: boolean;
  noBottomPadding?: boolean;
  maxVisibleItems?: number;
  disableAnimation?: boolean;
  width?: number;
  padding?: string;
  height?: number;
  withScrollbars?: boolean;
}

const MenuContainer = styled.ul<MenuContainerProps>`
  ${cardStyles};

  max-height: ${({ theme, withScrollbars, maxVisibleItems }) =>
    withScrollbars ? 'auto' : getMaxHeight(undefined, maxVisibleItems, theme.components.menuItem.height, true)};
  min-width: 100px;
  ${({ fullWidth }) => (fullWidth ? '' : 'max-width: 400px;')}
  ${({ width }) => (width ? `width: ${width}px;` : '')}
  ${({ height }) =>
    height &&
    css`
      height: ${height}px;
      max-height: ${height}px;
    `}
  margin-top: 1px;
  margin-bottom: 5px;
  padding: ${({ padding }) => padding || `${VERTICAL_PADDING}px 0`};
  border-radius: 5px;
  background: ${colors(ThemeColor.WHITE)};
  color: ${colors(ThemeColor.PRIMARY)};
  box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.06), 0 8px 16px 0 rgba(17, 49, 96, 0.16);
  font-size: 15px;
  line-height: 18px;
  list-style: none;
  overflow: hidden;
  will-change: transform;

  ${SlideDown}

  ${({ nativeScrollbar }) => nativeScrollbar && nativeScrollbarsStyle}

  ${({ disableAnimation }) =>
    !disableAnimation &&
    css`
      animation: fadein 0.15s ease, movein 0.15s ease, scaleY 0.1s ease;
    `}

  ${({ noTopPadding }) =>
    noTopPadding &&
    css`
      padding-top: 0;
    `}

  ${({ noBottomPadding }) =>
    noBottomPadding &&
    css`
      padding-bottom: 0;
    `}
`;

export default MenuContainer;
