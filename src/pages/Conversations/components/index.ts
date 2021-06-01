import Flex from '@/components/Flex';
import { styled } from '@/hocs';

export { default as TranscriptDetails } from './TranscriptDetails';
export { default as TranscriptDialog } from './TranscriptDialog';
export { default as TranscriptManager } from './TranscriptManager';

export const ConversationsContainer = styled(Flex)`
  flex-direction: row;
  height: 100%;
`;
