import { css, styled } from '@/hocs';
import { SlideOut, SlideOutDirection } from '@/styles/transitions';

export type DrawerDirection = SlideOutDirection;

export type DrawerProps = {
  scrollable?: boolean;
  zIndex?: number;
};

const Drawer = styled(SlideOut)<DrawerProps>`
  height: 100%;
  top: 0;
  bottom: 0;
  border-style: solid;
  border-width: 0;
  border-color: #dfe3ed;
  background-color: #fff;

  z-index: ${({ zIndex = 20 }) => zIndex};

  ${({ open }) =>
    !open &&
    css`
      > * {
        visibility: hidden;
      }
    `}

  ${({ direction = SlideOutDirection.RIGHT }) =>
    direction === SlideOutDirection.RIGHT
      ? css`
          border-right-width: 1px;
        `
      : css`
          border-left-width: 1px;
        `}

  ${({ scrollable }) =>
    scrollable &&
    css`
      overflow-y: scroll;
    `}
`;

export default Drawer;
