import { css, styled } from '@/hocs';

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
        padding-bottom: 44px;
      }

      .public-DraftStyleDefault-block > span {
        white-space: pre;
      }
    `}
`;
