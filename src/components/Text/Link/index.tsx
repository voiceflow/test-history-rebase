import { styled } from '@/hocs';

type LinkProps = {
  link?: string;
};

const Link = styled.a.attrs<LinkProps>(({ link, href }) => ({
  target: '_blank',
  rel: 'noopener noreferrer',
  href: link || href,
}));

export default Link;
