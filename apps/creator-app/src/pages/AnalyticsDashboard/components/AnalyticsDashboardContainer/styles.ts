import { Flex } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export const Container = styled(Flex)<{ isNewLayout?: boolean }>`
  height: calc(100% - ${({ theme, isNewLayout }) => (isNewLayout ? theme.components.header.newHeight : 0)}px);
  padding-left: ${({ theme, isNewLayout }) => (isNewLayout ? 0 : theme.components.sidebarIconMenu.width)}px;
  overflow-x: auto;
`;
