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
  box-shadow: 0 0 3px #d0d8e7;
  ${({ fullHeight }) =>
    fullHeight &&
    css`
      height: 100% !important;
    `}
  border-radius: 5px;

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
    margin-top: 30px;
  }

  .ace_string {
    color: #436282 !important;
  }

  .ace_gutter {
    background: #fff !important;
    color: #62778c !important;
    border-right: 1px solid #d2dae2;
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
