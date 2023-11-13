/* eslint-disable simple-import-sort/imports */
import React from 'react';
import AceEditor, { IAceEditorProps as AceEditorBaseProps } from 'react-ace';

import 'brace/ext/language_tools';
import 'brace/mode/javascript';
import 'brace/mode/json';
import 'brace/theme/chrome';
import './modes/json';
import './modes/slot';
import './modes/utterance';

/* eslint-enable simple-import-sort/imports */
import { css, styled } from '@/hocs/styled';

import { InputMode, AceEditorColors } from './constants';

export type AceEditorProps = AceEditorBaseProps & {
  variant?: string;
  fullHeight?: boolean;
  placeholder?: string;
  hasBorder?: boolean;
  inputMode?: InputMode;
  editorColors?: AceEditorColors;
  editorSpacing?: boolean;
  hideIndentGuide?: boolean;
  hideFoldWidgets?: boolean;
};

const StyledEditor = styled(AceEditor).attrs({
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
      border-radius: 6px;
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

  .ace_scrollbar .ace_scrollbar-h {
    width: 100%;

    &.ace_scrollbar-inner {
      width: 100%;
    }
  }

  .ace_gutter-active-line {
    margin-top: 0;
  }

  .ace_gutter {
    background: #fdfdfd !important;
    color: #8da2b5 !important;
    border-right: 1px solid #dfe3ed;
    ${({ setOptions }) =>
      setOptions?.fontFamily &&
      css`
        font-family: ${setOptions.fontFamily}, monospace;
      `};
  }

  .ace_utterance {
    color: #5d9df5;
  }

  .ace_slot {
    font-weight: 600;
  }

  .ace_comment.ace_placeholder {
    font-size: 13px;
    font-family: ${({ setOptions }) => (setOptions?.fontFamily ? `${setOptions.fontFamily}, monospace` : `'Monaco', monospace`)};
    padding-left: 2px !important;
  }

  .ace_placeholder {
    transform: none;
  }

  ${({ editorSpacing }) =>
    editorSpacing &&
    css`
      .ace_placeholder {
        margin-top: 12px !important;
      }
    `}

  ${({ inputMode }) =>
    inputMode === InputMode.INPUT &&
    css`
      &:not(.ace_focus) .ace_layer .ace_active-line {
        background-color: #fefefe !important;
      }
      ,
      &:not(.ace_focus) .ace_layer .ace_gutter-active-line {
        background-color: #fdfdfd !important;
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

  ${({ hideIndentGuide }) =>
    hideIndentGuide &&
    css`
      .ace_indent-guide {
        background: none;
      }
    `}

  ${({ hideFoldWidgets }) =>
    hideFoldWidgets &&
    css`
      .ace_folding-enabled .ace_fold-widget,
      .ace_fold-widget {
        display: none !important;
      }
    `}

  ${({ variant, editorColors }) => {
    // eslint-disable-next-line sonarjs/no-small-switch
    switch (variant) {
      // TODO:: add other variants here (datasource, etc.)
      case 'javascript':
      default:
        return css`
          & {
            width: 100% !important;
            box-sizing: border-box;
            outline: none;
            color: ${editorColors?.defaultColor || '#0b1a38'};
            background: #fefefe;
            cursor: text;
            resize: none;
            .ace_text-input {
              position: absolute !important;
            }

            ${editorColors &&
            css`
              .ace_regexp {
                color: ${editorColors.regexp} !important;
              }

              .ace_variable {
                color: ${editorColors.variable} !important;
              }

              .ace_numeric {
                color: ${editorColors.numeric} !important;
              }

              .ace_string {
                color: ${editorColors.string} !important;
              }

              .ace_constant.ace_language.ace_escape {
                color: ${editorColors.regexp} !important;
              }

              .ace_boolean {
                color: ${editorColors.boolean} !important;
              }

              .ace_storage.ace_type {
                color: ${editorColors.reservedWord} !important;
              }

              .ace_comment {
                color: ${editorColors.comment} !important;
              }
            `}
          }

          &.oneline :global(.public-DraftEditor-content) {
            min-height: 0;
          }

          & :global(.public-DraftEditor-content) {
            min-height: 68px;
          }
        `;
    }
  }}
`;

const Editor = React.forwardRef<AceEditor, AceEditorProps>((props, ref) => {
  const onLoad = React.useCallback((editor?: any) => {
    if (props.editorSpacing) {
      editor?.renderer?.setPadding(12);
    }
  }, []);

  return <StyledEditor {...(props as any)} ref={ref} onLoad={onLoad} />;
});

export default Editor;
