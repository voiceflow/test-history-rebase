import { Flex } from '@/components/Box';
import { styled } from '@/hocs';

export const SUGGESTION_HEIGHT = 80;

const SuggestionsContainer = styled(Flex)`
  height: ${SUGGESTION_HEIGHT}px;
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
  position: absolute;
  bottom: 80px;
`;

export default SuggestionsContainer;
