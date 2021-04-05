import { layout, space } from 'styled-system';

import { styled } from '@/hocs';
import { changeColorShade } from '@/utils/colors';

import { TextProps } from '../types';

type LinkProps = {
  link?: string;
  textDecoration?: boolean;
} & TextProps;

const Link = styled.a.attrs<LinkProps>(({ link, href, target = '_blank', rel = 'noopener noreferrer' }) => ({
  target,
  rel,
  href: link || href,
}))<LinkProps>`
  color: ${({ color, theme }) => color ?? theme.colors.blue};

  :hover {
    color: ${({ color, theme }) => changeColorShade(color || theme.colors.blue, -40)};
    ${({ textDecoration }) => !textDecoration && 'text-decoration: none !important;'}
  }

  ${space}
  ${layout}
`;

export default Link;
