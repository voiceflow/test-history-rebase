import { css, styled } from '@/hocs';

// eslint-disable-next-line import/prefer-default-export
export const SlideOut = styled.div`
  position: absolute;
  width: ${({ width }) => width}px;
  background-color: inherit;
  z-index: 20;

  ${({ disableAnimation }) =>
    !disableAnimation &&
    css`
      transition: transform 150ms ease;
    `}

  ${({ open, width, direction = 'right' }) => {
    if (direction === 'right') {
      return css`
        left: 0;
        ${open
          ? css`
              transform: translate3d(0, 0, 0);
            `
          : css`
              transform: translate3d(-${width}px, 0, 0);
            `};
      `;
    }

    return open
      ? css`
          right: 0;
          transform: translate3d(0, 0, 0);
        `
      : css`
          right: 0;
          transform: translate3d(${width}px, 0, 0);
        `;
  }}
`;
