import { Box, Text, User } from '@voiceflow/ui';

import { styled } from '@/hocs';

import { HEADER_HEIGHT } from '../../constants';

export const StyledUser = styled(User)`
  box-shadow: none;
  margin-right: 12px;
  width: 26px;
  height: 26px;
`;

export const StyledText = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 158px;
`;

export const SidebarActionsContainer = styled(Box.FlexApart)`
  height: calc(100% - ${HEADER_HEIGHT}px);
  width: 100%;
  flex-direction: column;
`;

export const SidebarGroup = styled(Box.FlexStart)`
  flex-direction: column;
  margin: 0 16px;
  height: 100%;
  width: calc(100% - 32px);
`;
