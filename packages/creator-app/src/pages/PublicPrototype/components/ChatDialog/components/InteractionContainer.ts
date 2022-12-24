import { Box } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

import { MOBILE_INPUT_CONTAINER_HEIGHT } from './InputContainer';

export const SUGGESTION_HEIGHT = 80;

const InteractionContainer = styled(Box)<{ isMobile?: boolean; showSuggestions?: boolean }>`
  ${({ isMobile, showSuggestions }) =>
    isMobile &&
    css`
      height: ${MOBILE_INPUT_CONTAINER_HEIGHT + (showSuggestions ? SUGGESTION_HEIGHT : 0)}px;
      width: 100%;
      background-color: #fff;
      position: fixed;
    `}
`;

export default InteractionContainer;
