import { Box, User } from '@voiceflow/ui';

import { css, styled } from '@/hocs';

import { HEADER_HEIGHT, SIDEBAR_WIDTH } from '../../constants';

export const SidebarWrapper = styled.aside`
  display: flex;
  width: ${SIDEBAR_WIDTH}px;
  border-right: 1px solid #dfe3ed;
  background-color: #fbfbfb;
  position: relative;
  color: #132144;
`;

export const Footer = styled.header<{ active: boolean }>`
  border-top: 1px solid #dfe3ed;
  width: 100%;
  height: ${HEADER_HEIGHT}px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: ${({ active }) => (active ? 'rgba(238,244,246,0.85)' : '#fbfbfb')};
  padding: 0 28px;
  position: absolute;
  bottom: 0;

  font-size: 15px;
  font-weight: 600;

  div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 158px;
  }
`;

export const StyledUser = styled(User)`
  box-shadow: none;
  margin-right: 12px;
  width: 26px;
  height: 26px;
`;

export const SidebarActionsContainer = styled(Box.FlexApart)`
  height: calc(100% - ${HEADER_HEIGHT}px);
  width: 100%;
  flex-direction: column;
`;

export const SidebarGroup = styled(Box.FlexStart)`
  flex-direction: column;
  margin: 16px;
  height: 100%;
  width: calc(100% - 32px);
`;

export const SidebarItemContainer = styled(Box.Flex)<{ active?: boolean }>`
  border-radius: 6px;
  width: 100%;
  justify-content: space-between;
  cursor: pointer;
  padding: 10px;

  ${({ active }) =>
    active &&
    css`
      border: 1px solid rgba(223, 227, 237, 1);
      background-color: rgba(255, 255, 255, 1);
      background: linear-gradient(180deg, rgba(238, 244, 246, 0.85) 0%, rgba(238, 244, 246, 1) 100%);
      font-weight: 600;
    `}

  & > a {
    opacity: 0;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 1);
    background: linear-gradient(180deg, rgba(238, 244, 246, 0.85) 0%, rgba(238, 244, 246, 1) 100%);

    & > a {
      opacity: 0.85;
    }
  }
`;
