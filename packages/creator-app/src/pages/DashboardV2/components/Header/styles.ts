import { Text } from '@voiceflow/ui';

import { styled } from '@/hocs';

import { HEADER_HEIGHT, SIDEBAR_WIDTH } from '../../constants';

export const HeaderWrapper = styled.header`
  border-bottom: 1px solid #dfe3ed;
  height: ${HEADER_HEIGHT}px;
  display: flex;
  color: #132144;
`;

export const SidebarHeader = styled.section`
  border-right: 1px solid #dfe3ed;
  height: 100%;
  width: ${SIDEBAR_WIDTH}px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 28px;
  background-color: #fdfdfd;

  font-size: 15px;
  font-weight: 600;
`;

export const WorkspaceActions = styled.section`
  height: 100%;
  width: calc(100% - ${SIDEBAR_WIDTH}px);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 28px;
  padding-right: 16px;
`;

export const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Title = styled(Text)`
  font-size: 18px;
  font-weight: 700;
`;
