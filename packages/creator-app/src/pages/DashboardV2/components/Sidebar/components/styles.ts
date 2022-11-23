import { Box } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs';

import { HEADER_HEIGHT, SIDEBAR_WIDTH } from '../../../constants';

export const WorkspaceSelectorContainer = styled.div<{ isOpen?: boolean }>`
  ${transition('background')}
  border-right: 1px solid #dfe3ed;
  border-bottom: 1px solid #dfe3ed;
  height: ${HEADER_HEIGHT}px;
  width: ${SIDEBAR_WIDTH + 1}px;
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
