import Flex from '@/components/Flex';
import { styled } from '@/hocs';

const Container = styled(Flex)`
  position: absolute;
  left: 22px;
  bottom: 16px;
  z-index: 20;

  transition: transform 350ms cubic-bezier(0.075, 0.82, 0.165, 1);
`;

export default Container;
