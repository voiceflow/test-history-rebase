import _styled, { css as _css, DefaultTheme, ThemedCssFunction, ThemedStyledInterface, ThemedStyledProps } from 'styled-components';

import { ThemeColor } from './theme';

export { ClassName } from './constants';
export { createTheme, ThemeColor } from './theme';
export { createGlobalStyle, keyframes, ThemeProvider } from 'styled-components';

export type StyledProps<P> = ThemedStyledProps<P, DefaultTheme>;

export const styled: ThemedStyledInterface<DefaultTheme> = _styled;

export const css: ThemedCssFunction<DefaultTheme> = _css;

export * from './bootstrap';

export const transition =
  (...properties: string[]) =>
  ({ theme }: { theme: DefaultTheme }): string =>
    theme.transition(...properties);

export const units =
  (count = 1) =>
  ({ theme }: { theme: DefaultTheme }): number =>
    theme.unit * count;

export const colors =
  (color: ThemeColor) =>
  ({ theme }: { theme: DefaultTheme }): string =>
    theme.colors[color];

export const iconColors =
  (color: keyof DefaultTheme['iconColors']) =>
  ({ theme }: { theme: DefaultTheme }): string =>
    theme.iconColors[color];

export const backgrounds =
  (background: keyof DefaultTheme['backgrounds']) =>
  ({ theme }: { theme: DefaultTheme }): string =>
    theme.backgrounds[background];
