import { css } from '../../styles';
import { flexCenterStyles } from '../Flex';

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

export const baseButtonStyles = css<ClickableProps>`
  ${flexCenterStyles}
  ${clickableStyles}
  padding: 0;
  background: inherit;
  border: 0;

  &:focus,
  &:active {
    outline: 0;
  }
`;
