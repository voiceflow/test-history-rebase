import { Flex } from '@voiceflow/ui';

import { styled } from '@/hocs';

export type FlowControlsContainerProps = {
  withMenu: boolean;
  withDrawer: boolean;
};

const FlowControlsContainer = styled(Flex)<FlowControlsContainerProps>`
  position: absolute;
  left: ${({ withMenu, withDrawer, theme }) =>
    withMenu ? theme.components.menuBar.width + (withDrawer ? theme.components.menuDrawer.width : 0) : 20}px;
  top: 2px;
  transition: left 150ms ease;
  z-index: 20;
  padding: 10px 10px 10px 0px;
  user-select: none;
`;

export default FlowControlsContainer;
