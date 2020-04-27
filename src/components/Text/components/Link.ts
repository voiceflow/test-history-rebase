import { color, layout, space } from 'styled-system';

import { styled } from '@/hocs';

import { TextProps } from '../types';

type LinkProps = {
  link?: string;
} & TextProps;

const Link = styled.a.attrs<LinkProps>(({ link, href }) => ({
  target: '_blank',
  rel: 'noopener noreferrer',
  href: link || href,
}))<LinkProps>`
  color: ${({ theme }) => theme.colors.blue};

  :hover {
    color: ${({ theme }) => theme.colors.darkBlue};
  }

  ${space}
  ${color}
  ${layout}
`;

export default Link;
