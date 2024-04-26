import type {
  ThemedCssFunction,
  ThemedStyledInterface,
  ThemedStyledProps,
  WithThemeFnInterface,
} from 'styled-components';
import _styled, { css as _css, withTheme as _withTheme } from 'styled-components';

import type { Theme } from '@/styles/theme';

export { createGlobalStyle, keyframes } from 'styled-components';

export type StyledProps<P> = ThemedStyledProps<P, Theme>;

export const withTheme: WithThemeFnInterface<Theme> = _withTheme;

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
