import Flex from '@/components/Flex';
import { styled } from '@/hocs';

const HeaderContent = styled(Flex)`
  /* truncated text hack https://css-tricks.com/flexbox-truncated-text/ */
  min-width: 0;
`;

export default HeaderContent;
