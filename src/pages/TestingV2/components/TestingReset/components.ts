import DefaultLink from '@/components/Link';
import { styled } from '@/hocs';

// eslint-disable-next-line import/prefer-default-export
export const Link = styled(DefaultLink).attrs({ as: 'span' })`
  padding: 5px;
  font-size: 16px;
`;
