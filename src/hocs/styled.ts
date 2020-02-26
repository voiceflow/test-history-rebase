import { Theme } from '@/styles/theme';

export { default as styled, css, keyframes, createGlobalStyle, withTheme } from 'styled-components';

export const transition = (...properties: string[]) => ({ theme }: { theme: Theme }): string => theme.transition(...properties);

export const units = (count = 1) => ({ theme }: { theme: Theme }): number => theme.unit * count;
