import { Box } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

interface BlockingPageProps {
  visible: boolean;
}

export const BlockingPage = styled(Box.FlexCenter)<BlockingPageProps>`
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};

  height: 100%;
  width: 100%;
  position: absolute;
  z-index: 1005;
  background: #f9f9f9bf;
  backdrop-filter: blur(5px);
  left: 0;
  top: ${({ theme }) => theme.components.header.height}px;
  margin-left: ${({ theme }) => theme.components.sidebarIconMenu.width}px;
`;
