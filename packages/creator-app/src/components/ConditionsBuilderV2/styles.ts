import { Box } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export const SidebarContainer = styled(Box.Flex)`
  width: 100%;
  margin-right: 16px;
  border-radius: 6px;
  padding: 11px 22px 11px 16px;
  background-color: white;

  :hover {
    background-color: rgba(238, 244, 246, 0.85);
  }
`;
