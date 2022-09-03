import { colors, css, styled, ThemeColor } from '@ui/styles';
import { ANIMATION_SPEED } from '@ui/styles/constants';

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
  width?: number;
  height?: number;
  inline?: boolean;
  padding?: string;
  fullWidth?: boolean;
  noTopPadding?: boolean;
  withScrollbars?: boolean;
  nativeScrollbar?: boolean;
  noBottomPadding?: boolean;
  maxVisibleItems?: number;
  disableAnimation?: boolean;
}

const MenuContainer = styled.ul<MenuContainerProps>`
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


  color: ${colors(ThemeColor.PRIMARY)};
  font-size: 15px;
  line-height: 18px;
  list-style: none;
  overflow: hidden;
  will-change: transform;
  padding: ${({ padding }) => padding || `${VERTICAL_PADDING}px 0`};

  ${({ inline }) =>
    inline
      ? css`
          margin: 0;
        `
      : css`
          margin-top: 1px;
          margin-bottom: 5px;
          border-radius: 5px;
          box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.06), 0 8px 16px 0 rgba(17, 49, 96, 0.16);
          background: ${colors(ThemeColor.WHITE)};
        `}

  ${({ nativeScrollbar }) => nativeScrollbar && nativeScrollbarsStyle}

  ${({ disableAnimation, inline }) =>
    !disableAnimation &&
    !inline &&
    css`
      animation: fadein ${ANIMATION_SPEED}s ease, movein ${ANIMATION_SPEED}s ease, scaleY 0.1s ease;
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
