import { css } from 'styled-components';

/* 
  The styles below were copy from bootstrap classes and avoid create layout issues with base components like
  inputs, buttons, links and so on. Most of those errors are related to fonts and text decoration. 
*/

export const fontResetStyle = css`
  margin: 0;
  font-size: inherit;
  font-family: inherit;
  line-height: inherit;
`;

export const linkResetStyle = css`
  text-decoration: none;
  background-color: transparent;
`;

export const listResetStyle = css`
  margin-top: 0;
`;
