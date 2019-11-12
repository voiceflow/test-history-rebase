export { default as styled, css, keyframes, createGlobalStyle } from 'styled-components';

export const transition = (...properties) => ({ theme }) => theme.transition(...properties);

export const units = (count = 1) => ({ theme }) => theme.unit * count;
