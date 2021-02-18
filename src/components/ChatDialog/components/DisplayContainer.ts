import { Flex } from '@/components/Box';
import { css, styled } from '@/hocs';

import { INPUT_CONTAINER_HEIGHT } from './InputContainer';
import { SUGGESTION_HEIGHT } from './SuggestionsContainer';

const DisplayContainer = styled(Flex)<{ showSuggestions?: boolean }>`
  min-height: calc(100% - ${INPUT_CONTAINER_HEIGHT}px);

  ${({ showSuggestions }) =>
    showSuggestions &&
    css`
      min-height: calc(100% - ${INPUT_CONTAINER_HEIGHT + SUGGESTION_HEIGHT}px);
    `}
`;

export default DisplayContainer;
