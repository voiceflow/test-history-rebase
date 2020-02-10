import { css, styled } from '@/hocs';
import { getScrollbarWidth } from '@/utils/dom';

const SCROLLBAR_WIDTH = getScrollbarWidth();
const MINIMUM_SCROLLBAR_WIDTH = 44;

// eslint-disable-next-line import/prefer-default-export
export const Container = styled.div`
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

      .public-DraftStyleDefault-block > span {
        white-space: pre;
      }
    `}
`;
