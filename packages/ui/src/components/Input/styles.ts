import { IS_SAFARI } from '@ui/config';
import { colors, css, ThemeColor } from '@ui/styles';
import { system } from 'styled-system';

export const inputFocusStyle = css`
  border: 1px solid ${colors(ThemeColor.BLUE)};
  outline: 0;
  box-shadow: 0 0 3px 0 rgba(17, 49, 96, 0.06);
`;

export const inputDisabledStyle = css`
  color: ${colors(ThemeColor.QUARTERNARY)};
  ${IS_SAFARI &&
  css`
    -webkit-text-fill-color: ${colors(ThemeColor.QUARTERNARY)};
  `}

  ${system({
    pointerEvents: {
      property: 'pointerEvents',
      transform: (value) => value || 'none',
    },
    cursor: {
      property: 'cursor',
      transform: (value) => value || 'auto',
    },
  })}
`;

export interface StyledInputProps {
  error?: boolean;
  cursor?: string;
  borderColor?: string;
}

export const inputStyle = css<StyledInputProps>`
  display: block;
  width: 100%;
  min-height: ${({ theme }) => theme.components.input.height}px;
  padding: 10px 16px;
  color: #132042;
  font: normal 15px Open Sans, Arial, sans-serif;
  font-size: 15px;
  line-height: 20px;
  background: ${colors(ThemeColor.WHITE)};
  border: 1px solid #d2dae2;
  border-radius: 6px;
  box-shadow: 0 0 3px 0 rgba(17, 49, 96, 0.06);
  cursor: text;
  transition: background-color 0.12s linear, color 0.12s linear, border-color 0.12s linear, box-shadow 0.12s linear, max-height 0.12s linear;

  &:disabled {
    ${inputDisabledStyle}
  }

  &:active,
  &:focus,
  &:focus-within {
    ${inputFocusStyle}
  }

  ${({ error, borderColor }) =>
    (error || borderColor) &&
    css`
      border: 1px solid ${error ? colors(ThemeColor.RED) : borderColor} !important;
    `}
`;
