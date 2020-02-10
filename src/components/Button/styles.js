import { css } from 'styled-components';

export const BUTTON_HEIGHT = 42;

// eslint-disable-next-line xss/no-mixed-html
export const clickableStyles = css`
  ${({ disabled }) =>
    disabled
      ? css`
          pointer-events: none;
        `
      : css`
          cursor: pointer;
        `}
`;
