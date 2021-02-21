import { cardStyles } from '@/components/Card';
import { css, styled } from '@/hocs';
import { SlideDown } from '@/styles/animations';

const MAX_VISIBLE_ITEMS = 7.5;

const nativeScrollbarsStyle = css`
  .scrollbars > div {
    overflow: auto !important;
  }
`;

export type MenuContainerProps = {
  fullWidth?: boolean;
  nativeScrollbar?: boolean;
  noBottomPadding?: boolean;
  maxVisibleItems?: number;
  disableAnimation?: boolean;
  width?: number;
};

const MenuContainer = styled.ul<MenuContainerProps>`
  ${cardStyles}

  max-height: ${({ theme, maxVisibleItems }) => theme.components.menuItem.height * (maxVisibleItems || MAX_VISIBLE_ITEMS)}px;
  min-width: 100px;
  ${({ fullWidth }) => (fullWidth ? '' : 'max-width: 400px;')}
  ${({ width }) => (width ? `width: ${width}px;` : '')}
  margin-top: 5px;
  margin-bottom: 5px;
  padding: 8px 0;
  border-radius: 5px;
  background: #fff;
  color: #132144;
  box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.06), 0 8px 16px 0 rgba(17, 49, 96, 0.16);
  font-size: 15px;
  line-height: 18px;
  list-style: none;
  overflow: hidden;

  ${SlideDown}

  ${({ nativeScrollbar }) => nativeScrollbar && nativeScrollbarsStyle}

  ${({ disableAnimation }) =>
    !disableAnimation &&
    css`
      animation: fadein 0.15s ease, movein 0.15s ease, scaleY 0.1s ease;
    `}

  ${({ noBottomPadding }) =>
    noBottomPadding &&
    css`
      padding-bottom: 0;
    `}
`;

export default MenuContainer;
