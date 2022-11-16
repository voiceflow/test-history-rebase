import { Box } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs';

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
  width: calc(100% - ${SIDEBAR_WIDTH}px);
  height: 60px;
  background-color: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borders};
  padding: 9px 16px 9px 0px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const WorkspaceSelectorContainer = styled.div<{ isOpen?: boolean }>`
  ${transition('background')}
  border-right: 1px solid #dfe3ed;
  height: 100%;
  width: ${SIDEBAR_WIDTH}px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 28px;
  background-color: #fdfdfd;

  font-size: 15px;
  font-weight: 600;

  span > svg {
    opacity: 0.85;
  }

  ${({ isOpen }) =>
    isOpen &&
    css`
      background: rgba(238, 244, 246, 1);
    `}

  &:active,
  &:hover {
    cursor: pointer;
    background: rgba(238, 244, 246, 1);

    span > svg {
      opacity: 1;
    }
  }
`;

export const WorkspaceItemContainer = styled(Box.FlexStart)`
  padding: 11px 0;
  width: 100%;
`;

export const WorkspaceImage = styled.img<{ active?: boolean }>`
  height: 26px;
  width: 26x;
  border-radius: ${({ active }) => (active ? '6px' : '50%')};
  margin-right: 12px;
`;

export const WorkspaceName = styled.div`
  max-width: 142px;
  margin-right: 12px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
