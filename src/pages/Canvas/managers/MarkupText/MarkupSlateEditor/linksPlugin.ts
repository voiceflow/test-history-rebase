/* eslint-disable no-param-reassign */
import isURL from 'is-url';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';

import { BlockType } from '../constants';
import type { MarkupEditor } from '.';
import MarkupSlateEditor from './editor';

// eslint-disable-next-line import/prefer-default-export
export const withLinks = <T extends ReactEditor & HistoryEditor>(baseEditor: T): MarkupEditor => {
  const editor = (baseEditor as any) as MarkupEditor;
  const { insertData, insertText, isInline } = editor;

  editor.isInline = (element) => (element.type === BlockType.LINK ? true : isInline(element));

  editor.insertText = (text) => {
    const isUrl = isURL(text);

    if (text && (isUrl || isURL(`//${text}`))) {
      MarkupSlateEditor.wrapLink(editor, isUrl ? text : `//${text}`, { pasted: true });
    } else {
      insertText(text);
    }
  };

  editor.insertData = (data) => {
    const text = data.getData('text/plain');
    const isUrl = isURL(text);

    if (text && (isUrl || isURL(`//${text}`))) {
      MarkupSlateEditor.wrapLink(editor, isUrl ? text : `//${text}`, { pasted: true });
    } else {
      insertData(data);
    }
  };

  return editor;
};
