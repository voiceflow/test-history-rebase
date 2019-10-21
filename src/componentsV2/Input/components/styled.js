import { css, units } from '@/hocs';

export const inputFocus = css`
  border: 1px solid #5d9df5;
  box-shadow: 0 0 3px 0 rgba(17, 49, 96, 0.06);
  outline: 0;
`;

export const inputMinHeight = css`
  min-height: 42px;
`;

export const inputStyle = css`
  ${inputMinHeight};
  display: block;
  width: 100%;
  color: #132042;
  font: normal 15px Open Sans, Arial, sans-serif;
  font-size: 15px;
  background: #fff;
  border: 1px solid #d2dae2;
  border-radius: 6px;
  padding: 10px ${units(2)}px 10px;
  line-height: 20px;
  cursor: text;
  transition: background-color 0.12s linear, color 0.12s linear, border-color 0.12s linear, box-shadow 0.12s linear, padding 0.12s linear,
    max-height 0.12s linear;

  &:active,
  &:focus,
  &:focus-within {
    ${inputFocus}
  }
`;
