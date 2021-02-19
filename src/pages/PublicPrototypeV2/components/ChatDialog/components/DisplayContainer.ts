import { styled } from '@/hocs';

import { DESKTOP_INPUT_CONTAINER_HEIGHT, MOBILE_INPUT_CONTAINER_HEIGHT } from './InputContainer';
import { SUGGESTION_HEIGHT } from './SuggestionsContainer';

const DisplayContainer = styled.div<{ showSuggestions?: boolean; isMobile?: boolean }>`
  display: flex;
  padding-top: ${({ isMobile }) => (isMobile ? 20 : 40)}px;

  height: ${({ isMobile, showSuggestions }) => {
    if (isMobile) {
      return `calc(100% - ${MOBILE_INPUT_CONTAINER_HEIGHT + (showSuggestions ? SUGGESTION_HEIGHT : 0)}px)`;
    }

    return `calc(100% - ${DESKTOP_INPUT_CONTAINER_HEIGHT + (showSuggestions ? SUGGESTION_HEIGHT : 0)}px)`;
  }};
`;

export default DisplayContainer;
