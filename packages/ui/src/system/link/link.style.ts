import { css, styled, transition } from '@ui/styles';
import { layout, LayoutProps, space, SpaceProps, typography, TypographyProps } from 'styled-system';

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
`;
