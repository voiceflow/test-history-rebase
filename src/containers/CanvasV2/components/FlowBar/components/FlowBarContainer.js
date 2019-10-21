import Flex from '@/componentsV2/Flex';
import { styled } from '@/hocs';

const FlowBar = styled(Flex)`
  z-index: 20;
  display: flex;
  width: 450px;
  margin-left: -225px;
  position: absolute;
  padding: 10px;
  margin-bottom: 0px;
  transition: left 150ms ease;
  left: ${({ withMenu }) => (withMenu ? '50%' : ' 42%')};
  bottom: 0;
  background: #fff;
  box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.04), 0 2px 4px 0 rgba(17, 49, 96, 0.16);
  border-radius: 5px 5px 0px 0px;
  cursor: default;
  user-select: none;
  animation: flowbar 0.15s ease-in-out, fadein 0.2s ease;
`;

export default FlowBar;
