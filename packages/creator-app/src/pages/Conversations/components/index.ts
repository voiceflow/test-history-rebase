import { Flex } from '@voiceflow/ui';

import { css, styled } from '@/hocs';

export { default as TranscriptDetails } from './TranscriptDetails';
export { default as TranscriptDialog } from './TranscriptDialog';
export { default as TranscriptManager } from './TranscriptManager';

export const ConversationsContainer = styled(Flex)<{ isFilteredResultsEmpty: boolean }>`
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
  flex-direction: row;
  height: 100%;
`;
