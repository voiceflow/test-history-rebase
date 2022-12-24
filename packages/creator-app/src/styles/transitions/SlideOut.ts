import { css, styled, transition } from '@/hocs/styled';

export enum SlideOutDirection {
  LEFT = 'left',
  RIGHT = 'right',
}

export interface SlideOutProps {
  open?: boolean;
  width: number;
  zIndex?: number;
  offset?: number;
  direction?: SlideOutDirection;
  disableAnimation?: boolean;
}

export const SlideOut = styled.div<SlideOutProps>`
  position: absolute;
  width: ${({ width }) => width}px;
  background-color: inherit;
  z-index: ${({ zIndex = 20 }) => zIndex};

  ${({ disableAnimation }) =>
    !disableAnimation &&
    css`
      ${transition('transform')}
    `}

  ${({ open, width, offset = 0, direction = SlideOutDirection.RIGHT }) => {
    if (direction === SlideOutDirection.RIGHT) {
      return open
        ? css`
            left: ${offset}px;
            transform: translate3d(0, 0, 0);
          `
        : css`
            left: ${offset}px;
            transform: translate3d(${-width}px, 0, 0);
          `;
    }

    return open
      ? css`
          right: ${offset}px;
          transform: translate3d(0, 0, 0);
        `
      : css`
          right: ${offset}px;
          transform: translate3d(${width}px, 0, 0);
        `;
  }}
`;
