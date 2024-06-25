import type { FlattenInterpolation } from 'styled-components';

import { css } from '@/hocs/styled';

import type { Theme } from '../theme';

/**
 * The `breakpoints` (mobile-first) utility constructs a `css` snippet to quickly implement
 * breakpoints, where breakpoint thresholds are defined by our themes system.
 *
 * Define `xs` for extra-small devices (e.g. portrait-mode phones), `sm` for small devices
 * (e.g. landscape-phones), etc.
 *
 * @param css An object containing the css to apply at each breakpoint.
 * @returns A css snippet that can be inserted into an `styled-component`
 */
export const breakpoints =
  ({
    xs,
    sm,
    md,
    lg,
    xl,
  }: {
    xs?: FlattenInterpolation<any>;
    sm?: FlattenInterpolation<any>;
    md?: FlattenInterpolation<any>;
    lg?: FlattenInterpolation<any>;
    xl?: FlattenInterpolation<any>;
  } = {}) =>
  ({ theme }: { theme: Theme }) => css`
    ${xs}
    ${sm &&
    css`
      @media (min-width: ${theme.breakpoints.sm}) {
        ${sm}
      }
    `}
  ${md &&
    css`
      @media (min-width: ${theme.breakpoints.md}) {
        ${md}
      }
    `}
  ${lg &&
    css`
      @media (min-width: ${theme.breakpoints.lg}) {
        ${lg}
      }
    `}
  ${xl &&
    css`
      @media (min-width: ${theme.breakpoints.xl}) {
        ${xl}
      }
    `}
  `;
