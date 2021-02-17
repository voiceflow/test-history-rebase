import _styled, {
  css as _css,
  ThemedCssFunction,
  ThemedStyledInterface,
  ThemedStyledProps,
  withTheme as _withTheme,
  WithThemeFnInterface,
} from 'styled-components';
import { ValuesType } from 'utility-types';

import { BlockVariant } from '@/constants/canvas';
import { Theme } from '@/styles/theme';

export { keyframes, createGlobalStyle } from 'styled-components';

export type StyledProps<P> = ThemedStyledProps<P, Theme>;

export const withTheme: WithThemeFnInterface<Theme> = _withTheme;

export const styled: ThemedStyledInterface<Theme> = _styled;

export const css: ThemedCssFunction<Theme> = _css;

export const transition = (...properties: string[]) => ({ theme }: { theme: Theme }): string => theme.transition(...properties);

export const units = (count = 1) => ({ theme }: { theme: Theme }): number => theme.unit * count;

export const withBlockVariantStyle = (createStyle: (variant: ValuesType<Theme['components']['block']['variants']>) => any) => ({
  variant,
  theme,
}: {
  variant: BlockVariant;
  theme: Theme;
}) => createStyle(theme.components.block.variants[variant]);
