import { css } from '@/hocs';

export const BUTTON_HEIGHT = 42;

export type ClickableProps = {
  disabled?: boolean;
};

export const clickableStyles = css<ClickableProps>`
  ${({ disabled }) =>
    disabled
      ? css`
          pointer-events: none;
        `
      : css`
          cursor: pointer;
        `}
`;
