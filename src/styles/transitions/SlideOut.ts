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
  transform: translateX(0);
  z-index: 20;

  ${({ disableAnimation }) =>
    !disableAnimation &&
    css`
      ${transition('transform')}
      will-change: transform;
    `}

  ${({ open, width, offset = 0, direction = SlideOutDirection.RIGHT }) => {
    if (direction === SlideOutDirection.RIGHT) {
      return css`
        left: -${width}px;

        ${open &&
        css`
          transform: translateX(${offset + width}px);
        `};
      `;
    }

    return css`
      right: ${-width}px;

      ${open &&
      css`
        transform: translateX(-${offset + width}px);
      `};
    `;
  }}
`;
