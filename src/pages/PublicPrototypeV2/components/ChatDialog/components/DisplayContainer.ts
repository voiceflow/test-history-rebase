import { css, styled } from '@/hocs';

import { INPUT_CONTAINER_HEIGHT } from './InputContainer';
import { SUGGESTION_HEIGHT } from './SuggestionsContainer';

const DisplayContainer = styled.div<{ showSuggestions?: boolean; isMobile?: boolean }>`
  display: flex;
  height: calc(100% - ${INPUT_CONTAINER_HEIGHT}px);
  padding-top: ${({ isMobile }) => (isMobile ? 20 : 40)}px;

  ${({ showSuggestions }) =>
    showSuggestions &&
    css`
      height: calc(100% - ${INPUT_CONTAINER_HEIGHT + SUGGESTION_HEIGHT}px);
    `}
`;

export default DisplayContainer;
