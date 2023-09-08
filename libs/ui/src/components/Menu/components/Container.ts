import Popper from '@ui/components/Popper';
import { colors, css, styled, ThemeColor } from '@ui/styles';
import { fadeInKeyframes, moveInTopKeyframes, scaleInYKeyframes } from '@ui/styles/animations';
import { listResetStyle } from '@ui/styles/bootstrap';
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

export interface ContainerProps {
  width?: number;
  height?: number;
  inline?: boolean;
  padding?: string;
  fullWidth?: boolean;
  noMargins?: boolean;
  noTopPadding?: boolean;
  withScrollbars?: boolean;
  nativeScrollbar?: boolean;
  noBottomPadding?: boolean;
  maxVisibleItems?: number;
  disableAnimation?: boolean;
}

const Container = styled.ul<ContainerProps>`
  ${listResetStyle}

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
  padding: ${({ padding }) => padding || `${VERTICAL_PADDING}px 0`};

  ${({ inline }) =>
    inline
      ? css`
          margin: 0;
        `
      : css`
          ${Popper.baseStyles}
          border-radius: 6px;
          margin-bottom: 5px;
          background: ${colors(ThemeColor.WHITE)};
        `}

  ${({ nativeScrollbar }) => nativeScrollbar && nativeScrollbarsStyle}

  ${({ disableAnimation, inline }) =>
    !disableAnimation &&
    !inline &&
    css`
      will-change: transform;
      animation: ${fadeInKeyframes} ${ANIMATION_SPEED}s ease, ${moveInTopKeyframes} ${ANIMATION_SPEED}s ease, ${scaleInYKeyframes} 0.1s ease;
      transform-origin: top;

      &[data-placement^='top'] {
        transform-origin: bottom;
      }
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

  ${({ noMargins }) =>
    noMargins &&
    css`
      margin: 0;
    `}
`;

export default Container;
