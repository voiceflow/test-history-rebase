import { User } from '@voiceflow/ui';

import { styled } from '@/hocs';

import { HEADER_HEIGHT, SIDEBAR_WIDTH } from '../../constants';

export const SidebarWrapper = styled.aside`
  display: flex;
  width: ${SIDEBAR_WIDTH}px;
  border-right: 1px solid #dfe3ed;
  background-color: #fbfbfb;
  position: relative;
  color: #132144;
`;

export const Footer = styled.header`
  border-top: 1px solid #dfe3ed;
  width: 100%;
  height: ${HEADER_HEIGHT}px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: #fdfdfd;
  padding-left: 28px;
  position: absolute;
  bottom: 0;

  font-size: 15px;
  font-weight: 600;
`;

export const StyledUser = styled(User)`
  box-shadow: none;
  width: 26px;
  height: 26px;
  margin-right: 12px;
`;
