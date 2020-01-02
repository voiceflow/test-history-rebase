import Flex from '@/componentsV2/Flex';
import { styled, units } from '@/hocs';

const FlowControlsContainer = styled(Flex)`
  position: absolute;
  float: left
  left: ${({ withMenu, withDrawer, theme }) =>
    withMenu ? theme.components.menuBar.width + (withDrawer ? theme.components.menuDrawer.width : 0) : 20}px;
  top: 2px;
  transition: left 150ms ease;
  z-index: 20;
  padding: ${units(2)}px;
  user-select: none;
`;

export default FlowControlsContainer;
