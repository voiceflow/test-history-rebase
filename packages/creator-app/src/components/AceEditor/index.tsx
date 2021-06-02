/* eslint-disable simple-import-sort/imports */
import AceEditor, { AceEditorProps as AceEditorBaseProps } from 'react-ace';

import 'brace/ext/language_tools';
import 'brace/mode/javascript';
import 'brace/mode/json';
import 'brace/theme/chrome';
import './modes/json';
import './modes/slot';
import './modes/utterance';

/* eslint-enable simple-import-sort/imports */
import { css, styled } from '@/hocs';

export enum InputMode {
  INPUT = 'input',
}

export const ACE_EDITOR_OPTIONS = {
  enableBasicAutocompletion: true,
  enableLiveAutocompletion: true,
  enableSnippets: false,
  showLineNumbers: true,
  tabSize: 2,
  useWorker: false,
};

export type AceEditorProps = AceEditorBaseProps & {
  variant?: string;
  fullHeight?: boolean;
  placeholder?: string;
  hasBorder?: boolean;
  inputMode?: InputMode;
};

export default styled(AceEditor).attrs<AceEditorProps>({
  fontSize: 13,
  showGutter: true,
  showPrintMargin: false,
  highlightActiveLine: true,
  editorProps: { $blockScrolling: true },
})<AceEditorProps>`
  ${({ fullHeight }) =>
    fullHeight &&
    css`
      height: 100% !important;
    `}

  ${({ hasBorder = false }) =>
    hasBorder &&
    css`
      border-radius: 5px;
      box-shadow: 0 0 3px 0 rgba(17, 49, 96, 0.06);
      border: solid 1px #d4d9e6;
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
    border-right: 1px solid #dfe3ed;
  }

  .ace_utterance {
    color: #5d9df5;
  }

  .ace_slot {
    font-weight: 600;
  }

  ${({ inputMode }) =>
    inputMode === InputMode.INPUT &&
    css`
      .ace_layer .ace_active-line {
        background-color: #fff !important;
      }
      .ace_scroller .ace_layer.ace_text-layer,
      .ace_scroller .ace_comment.ace_placeholder {
        padding-left: 4px !important;
      }
      .ace_hidden-cursors .ace_cursor {
        opacity: 0 !important;
      }
      .ace_scrollbar .ace_scrollbar-v,
      .ace_scrollbar .ace_scrollbar-h {
        display: none !important;
      }
    `}

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
