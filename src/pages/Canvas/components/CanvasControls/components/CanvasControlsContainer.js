import Flex from '@/componentsV2/Flex';
import { styled, units } from '@/hocs';

const CanvasControlsContainer = styled(Flex)`
  position: absolute;
  left: ${({ withMenu, withDrawer, theme }) =>
    withMenu ? theme.components.menuBar.width + (withDrawer ? theme.components.menuDrawer.width : 0) : 20}px;
  bottom: 0;
  transition: left 150ms ease;
  z-index: 20;
  padding: ${units(2)}px;

  & > * {
    margin-right: ${units(1.3)}px;
  }
`;

export default CanvasControlsContainer;
