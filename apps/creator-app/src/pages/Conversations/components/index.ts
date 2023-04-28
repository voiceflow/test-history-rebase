import { Flex } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

export { default as TranscriptDetails } from './TranscriptDetails';
export { default as TranscriptDialog } from './TranscriptDialog';
export { default as TranscriptManager } from './TranscriptManager';

export const ConversationsContainer = styled(Flex)<{ isFilteredResultsEmpty: boolean }>`
  height: 100%;
  padding-left: ${({ theme }) => theme.components.sidebarIconMenu.width}px;
  flex-direction: row;

  ${({ isFilteredResultsEmpty }) =>
    isFilteredResultsEmpty
      ? css`
          display: flex;
          align-items: center;
          justify-content: center;
        `
      : css`
        & > span {
          margin-left: 25%;
      `}
`;
