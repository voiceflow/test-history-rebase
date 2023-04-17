import { getScrollbarWidth } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

const SCROLLBAR_WIDTH = getScrollbarWidth();
const MINIMUM_SCROLLBAR_WIDTH = 44;

export const Container = styled.div<{ multiline?: boolean; fullWidth?: boolean }>`
  flex: 1;

  ${({ multiline }) =>
    !multiline &&
    css`
      .DraftEditor-editorContainer {
        height: 22px;
        overflow-y: hidden;
      }

      .public-DraftEditor-content {
        overflow-x: scroll;
        overflow-y: hidden;
        padding-bottom: ${Math.max(SCROLLBAR_WIDTH, MINIMUM_SCROLLBAR_WIDTH)}px;
      }

      .public-DraftStyleDefault-block {
        white-space: pre;
      }

      .public-DraftStyleDefault-block > span {
        white-space: pre;
      }
    `};

  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}
`;
