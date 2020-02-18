/* eslint-disable simple-import-sort/sort */
import AceEditor from 'react-ace';
import { styled, css } from '@/hocs';

import 'brace/ext/language_tools';
import 'brace/mode/javascript';
import 'brace/mode/json';
import 'brace/mode/json_custom';
import 'brace/theme/chrome';
/* eslint-enable simple-import-sort/sort */

export default styled(AceEditor).attrs({
  fontSize: 13,
  showGutter: true,
  showPrintMargin: false,
  highlightActiveLine: true,
  editorProps: { $blockScrolling: true },
})`
  ${({ fullHeight }) =>
    fullHeight &&
    css`
      height: 100% !important;
    `}

  .ace_custom_variable {
    display: inline;
    text-decoration: none;
    background-color: #eef4f6;
    color: #132144;
    border: 1px solid #dfe3ed;
    margin: -1px;

    border-radius: 7px;
  }
  .ace_scroller {
    &.ace_scroll-left {
      box-shadow: none;
    }
  }
  .ace_gutter-active-line {
    margin-top: 0;
  }

  .ace_gutter {
    background: #fdfdfd !important;
    color: #8da2b5 !important;
    border-right: 1px solid #eaeff4;
  }

  ${({ variant }) => {
    // eslint-disable-next-line sonarjs/no-small-switch
    switch (variant) {
      // TODO:: add other variants here (datasource, etc.)
      case 'javascript':
      default:
        return css`
          & {
            box-sizing: border-box;
            outline: none;

            color: #0b1a38;
            background: #fefefe;
            cursor: text;
            resize: none;
            .ace_text-input {
              position: absolute !important;
            }
          }

          /* stylelint-disable-next-line selector-pseudo-class-no-unknown */
          &.oneline :global(.public-DraftEditor-content) {
            min-height: 0;
          }

          /* stylelint-disable-next-line selector-pseudo-class-no-unknown */
          & :global(.public-DraftEditor-content) {
            min-height: 68px;
          }
        `;
    }
  }}
`;
