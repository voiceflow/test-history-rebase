import Flex from '@/componentsV2/Flex';
import { styled } from '@/hocs';

const ModalRoot = styled(Flex)`
  position: fixed;
  flex-direction: column;
  width: 100%;
  height: 100%;
  z-index: 1000;
  pointer-events: none;
`;

export default ModalRoot;
