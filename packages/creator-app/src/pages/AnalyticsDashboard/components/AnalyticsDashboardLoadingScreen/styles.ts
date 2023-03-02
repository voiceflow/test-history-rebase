import { Box } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

interface BlockingPageProps {
  visible: boolean;
}

const TOP_BAR_HEIGHT = `${42 + 16 + 16}px`;

export const BlockingPage = styled(Box.FlexCenter)<BlockingPageProps>`
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};

  height: calc(100% - ${TOP_BAR_HEIGHT});
  width: 100%;
  position: absolute;
  z-index: 1005;
  background: rgba(255, 255, 255, 65%);
  backdrop-filter: blur(5px);
  left: 0;
  top: ${TOP_BAR_HEIGHT};
  margin-left: ${({ theme }) => theme.components.sidebarIconMenu.width}px;
`;
