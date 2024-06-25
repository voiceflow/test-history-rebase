import { Box } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs/styled';

interface BlockingPageProps {
  visible: boolean;
  isNewLayout?: boolean;
}

export const BlockingPage = styled(Box.FlexCenter)<BlockingPageProps>`
  top: ${({ theme, isNewLayout }) => (isNewLayout ? theme.components.header.newHeight : 135)}px;
  left: ${({ theme, isNewLayout }) =>
    isNewLayout ? theme.components.sidebarIconMenu.newWidth : theme.components.sidebarIconMenu.width}px;
  width: calc(
    100% -
      ${({ theme, isNewLayout }) =>
        isNewLayout ? theme.components.sidebarIconMenu.newWidth : theme.components.sidebarIconMenu.width}px
  );
  height: calc(100% - ${({ theme, isNewLayout }) => (isNewLayout ? theme.components.header.newHeight : 135)}px);
  position: absolute;
  z-index: 1005;
  background: rgba(255, 255, 255, 65%);
  backdrop-filter: blur(5px);
  transition: ${transition('opacity')};

  ${({ visible }) =>
    visible
      ? css`
          opacity: 1;
          pointer-events: all;
        `
      : css`
          opacity: 0;
          pointer-events: none;
        `}
`;
