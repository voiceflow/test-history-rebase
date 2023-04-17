import { IS_SAFARI } from '@voiceflow/ui';

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
  ${!IS_SAFARI &&
  (({ width }) =>
    css`
      width: ${width}px;
    `)};
  background-color: inherit;
  z-index: ${({ zIndex = 20 }) => zIndex};

  ${({ disableAnimation }) =>
    !disableAnimation &&
    css`
      ${IS_SAFARI ? transition('width') : transition('transform')}
    `}

  ${({ open, width, offset = 0, direction = SlideOutDirection.RIGHT }) => {
    if (direction === SlideOutDirection.RIGHT) {
      return IS_SAFARI
        ? css`
            width: ${open ? width : 0}px;
            left: ${offset}px;
          `
        : css`
            left: ${offset}px;
            transform: translate3d(${open ? 0 : -width}px, 0, 0);
          `;
    }

    return IS_SAFARI
      ? css`
          width: ${open ? width : 0}px;
          right: ${offset}px;
        `
      : css`
          right: ${offset}px;
          transform: translate3d(${open ? 0 : width}px, 0, 0);
        `;
  }};
`;
