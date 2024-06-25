import { css, styled, transition } from '@ui/styles';
import { linkResetStyle } from '@ui/styles/bootstrap';
import { changeColorShade } from '@ui/utils/colors';
import type { LayoutProps, SpaceProps, TypographyProps } from 'styled-system';
import { layout, space, typography } from 'styled-system';

export interface LinkProps extends LayoutProps, SpaceProps, TypographyProps {
  link?: string;
  color?: string;
  $hidden?: boolean;
  isActive?: boolean;
  disabled?: boolean;
  $textDecoration?: boolean;
}

const PROTOCOL_POSTFIX_REGEXP = /:?\/\//;

const formatHref = (href: string | undefined, isBlank: boolean) =>
  !isBlank || !href || !!href.match(PROTOCOL_POSTFIX_REGEXP) ? href : `//${href}`;

export const linkStyles = css<LinkProps>`
  ${transition('color')}
  ${linkResetStyle}

  color: ${({ color, $hidden }) => color ?? ($hidden ? 'inherit' : '#3d82e2')};
  cursor: pointer;
  user-select: none;

  :hover {
    color: ${({ color }) => (color ? changeColorShade(color, -40) : '#3876CB')};
  }

  :active {
    color: ${({ color }) => (color ? changeColorShade(color, -60) : '#3876CB')};
  }

  ${({ color, isActive }) =>
    isActive &&
    css`
      color: ${color ? changeColorShade(color, -60) : '#3876CB'};
    `}

  ${({ $textDecoration }) =>
    !$textDecoration &&
    css`
      text-decoration: none !important;
    `}

  ${({ theme, disabled }) =>
    disabled
      ? css`
          color: ${theme.colors.tertiary};
          pointer-events: none;
        `
      : css`
          cursor: pointer;
        `}

  ${space}
  ${layout}
  ${typography}
`;

/**
 * @deprecated Use `System.Link.Anchor` instead
 */
const Link = styled.a.attrs<LinkProps>(({ link, href, target = '_blank', rel = 'noopener noreferrer' }) => ({
  rel,
  href: formatHref(link || href, target === '_blank'),
  target,
}))<LinkProps>`
  ${linkStyles}
`;

export default Link;
