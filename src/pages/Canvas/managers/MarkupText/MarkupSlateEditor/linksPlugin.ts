import isURL from 'is-url';
import { Editor } from 'slate';

import MarkupSlateEditor from './editor';

// eslint-disable-next-line import/prefer-default-export
export const withLinks = (editor: Editor): Editor => {
  const { insertData, insertText, isInline } = editor;

  editor.isInline = (element) => (MarkupSlateEditor.isLink(element) ? true : isInline(element));

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
