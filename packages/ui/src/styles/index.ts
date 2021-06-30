import _styled, { css as _css, ThemedCssFunction, ThemedStyledInterface, ThemedStyledProps } from 'styled-components';

import type { Theme } from './theme';

export { createTheme } from './theme';
export { createGlobalStyle, keyframes } from 'styled-components';

export type StyledProps<P> = ThemedStyledProps<P, Theme>;

export const styled: ThemedStyledInterface<Theme> = _styled;

export const css: ThemedCssFunction<Theme> = _css;

export const transition =
  (...properties: string[]) =>
  ({ theme }: { theme: Theme }): string =>
    theme.transition(...properties);

export const units =
  (count = 1) =>
  ({ theme }: { theme: Theme }): number =>
    theme.unit * count;

export const colors =
  (color: keyof Theme['colors']) =>
  ({ theme }: { theme: Theme }): string =>
    theme.colors[color];

export const iconColors =
  (color: keyof Theme['iconColors']) =>
  ({ theme }: { theme: Theme }): string =>
    theme.iconColors[color];

export const backgrounds =
  (background: keyof Theme['backgrounds']) =>
  ({ theme }: { theme: Theme }): string =>
    theme.backgrounds[background];
