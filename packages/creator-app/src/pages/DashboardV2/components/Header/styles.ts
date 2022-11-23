import { Box } from '@voiceflow/ui';

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

export const RightSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  text-align: left;
`;

export const StyledTabButton = styled(Box.FlexCenter)`
  padding: 8px 22px 10px;
  color: ${({ theme }) => theme.colors.quaternary};
  font-weight: 600;
  cursor: pointer;
  line-height: 18px;
  height: 42px;
`;

export const HeaderContainer = styled.div`
  width: 100%;
  height: 60px;
  background-color: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borders};
  padding: 9px 16px 9px 0px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
