import { css, styled, transition } from '@/hocs';

export enum SlideOutDirection {
  LEFT = 'left',
  RIGHT = 'right',
}

export type SlideOutProps = {
  open?: boolean;
  width: number;
  offset?: number;
  direction?: SlideOutDirection;
  disableAnimation?: boolean;
};

export const SlideOut = styled.div<SlideOutProps>`
  position: absolute;
  width: ${({ width }) => width}px;
  background-color: inherit;
  z-index: 20;

  ${({ disableAnimation }) =>
    !disableAnimation &&
    css`
      ${transition('transform')}
    `}

  ${({ open, width, offset = 0, direction = SlideOutDirection.RIGHT }) => {
    if (direction === SlideOutDirection.RIGHT) {
      return css`
        left: 0;
        ${open
          ? css`
              transform: translate3d(${offset}px, 0, 0);
            `
          : css`
              transform: translate3d(-${width}px, 0, 0);
            `};
      `;
    }

    return open
      ? css`
          right: 0;
          transform: translate3d(-${offset}px, 0, 0);
        `
      : css`
          right: 0;
          transform: translate3d(${width}px, 0, 0);
        `;
  }}
`;
