import { Link } from 'react-router-dom';
import type { LayoutProps, SpaceProps, TypographyProps } from 'styled-system';
import { layout, space, typography } from 'styled-system';

import { css, styled, transition } from '@/styles';
import { fontResetStyle, linkResetStyle } from '@/styles/bootstrap';

export interface SystemProps extends LayoutProps, SpaceProps, TypographyProps {}

export interface BaseStyleProps extends SystemProps {
  $color: string;
  $active: boolean;
  $disabled: boolean;
  $hoverColor: string;
  $activeColor: string;
  $textDecoration: boolean;
}

export const baseStyle = css<BaseStyleProps>`
  ${transition('color')}

  cursor: pointer;
  user-select: none;

  ${({ $color, $active, $hoverColor, $activeColor, $textDecoration }) =>
    $active
      ? css`
          color: ${$activeColor} !important;
          text-decoration: ${$textDecoration ? 'underline' : 'none'} !important;
        `
      : css`
          color: ${$color};

          &:hover {
            color: ${$hoverColor};
            text-decoration: ${$textDecoration ? 'underline' : 'none'};
          }

          &:active {
            color: ${$activeColor};
            text-decoration: ${$textDecoration ? 'underline' : 'none'};
          }
        `};

  ${({ theme, $disabled }) =>
    $disabled
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
  ${linkResetStyle}
`;

export const Router = styled(Link)`
  ${baseStyle};
`;

export const Anchor = styled.a`
  ${baseStyle}
`;

export const Button = styled.button`
  display: inline;
  padding: 0;
  border: none;
  background: none;
  box-shadow: none;
  ${baseStyle}
  ${fontResetStyle}
`;
