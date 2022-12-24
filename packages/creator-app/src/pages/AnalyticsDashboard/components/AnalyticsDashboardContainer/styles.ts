import { Flex } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export const Container = styled(Flex)`
  height: 100%;
  padding-left: ${({ theme }) => theme.components.sidebarIconMenu.width}px;
`;
