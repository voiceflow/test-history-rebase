import { css, styled, transition } from '@ui/styles';
import { changeColorShade } from '@ui/utils/colors';
import { layout, LayoutProps, space, SpaceProps } from 'styled-system';

export interface LinkProps extends LayoutProps, SpaceProps {
  link?: string;
  color?: string;
  isActive?: boolean;
  disabled?: boolean;
  unstyled?: boolean;
  $textDecoration?: boolean;
}

const PROTOCOL_POSTFIX_REGEXP = /:?\/\//;

const formatHref = (href: string | undefined, isBlank: boolean) => (!isBlank || !href || !!href.match(PROTOCOL_POSTFIX_REGEXP) ? href : `//${href}`);

export const linkStyles = css<LinkProps>`
  ${transition('color')}

  color: ${({ color, theme }) => color ?? theme.colors.blue};
  cursor: pointer;
  user-select: none;

  :hover {
    color: ${({ color, theme }) => changeColorShade(color || theme.colors.blue, -40)};
  }

  :active {
    color: ${({ color, theme }) => changeColorShade(color || theme.colors.blue, -60)};
  }

  ${({ color, theme, isActive }) =>
    isActive &&
    css`
      color: ${changeColorShade(color || theme.colors.blue, -60)};
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
`;

const Link = styled.a.attrs<LinkProps>(({ link, href, target = '_blank', rel = 'noopener noreferrer' }) => ({
  rel,
  href: formatHref(link || href, target === '_blank'),
  target,
}))<LinkProps>`
  ${linkStyles}
`;

export default Link;
