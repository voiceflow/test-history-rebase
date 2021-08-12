import { slate } from '@voiceflow/internal';
import { Descendant, Editor, Element, Range, Text, Transforms } from 'slate';

import { Nullable } from '@/types';
import { isURL } from '@/utils/string';

import { DEFAULT_COLOR, ElementType, TextProperty } from '../../constants';
import type { EditorAPIType } from '../editorAPI';
import type { Color, LinkElement } from '../types';

const LINK_COLOR: Color = { r: 93, g: 157, b: 245, a: 1 };

export interface LinksEditorAPI {
  link: (editor: Editor) => Nullable<LinkElement>;
  isLink: (node: Descendant) => node is LinkElement;
  wrapLink: (editor: Editor, url: string, options?: { pasted?: boolean }) => void;
  unwrapLink: (editor: Editor) => void;
}

export const withLinksPlugin =
  (EditorAPI: EditorAPIType) =>
  (editor: Editor): Editor => {
    const { insertData: originalInsertData, insertText: originalInsertText, isInline: originalIsInline } = editor;

    editor.isInline = (element) => (EditorAPI.isLink(element) ? true : originalIsInline(element));

    editor.insertText = (text) => {
      const isUrl = isURL(text);

      if (text && (isUrl || isURL(`//${text}`))) {
        EditorAPI.wrapLink(editor, isUrl ? text : `//${text}`, { pasted: true });
      } else {
        originalInsertText(text);
      }
    };

    editor.insertData = (data) => {
      const text = data.getData('text/plain');
      const isUrl = isURL(text);

      if (text && (isUrl || isURL(`//${text}`))) {
        EditorAPI.wrapLink(editor, isUrl ? text : `//${text}`, { pasted: true });
      } else {
        originalInsertData(data);
      }
    };

    return editor;
  };

export const withLinksEditorApi = (EditorAPI: EditorAPIType): EditorAPIType => {
  const LinksEditorAPI: LinksEditorAPI = {
    isLink: (node): node is LinkElement => Element.isElement(node) && slate.isLinkElement(node),

    link: (editor): Nullable<LinkElement> => {
      const [entry] = EditorAPI.nodes(editor, {
        at: editor.getFakeSelectionRange() || editor.selection || EditorAPI.fullRange(editor),
        match: EditorAPI.isLink,
      });

      return entry?.[0] || null;
    },

    unwrapLink: (editor: Editor): void => {
      const fakeSelection = editor.getFakeSelectionRange();
      const selection = fakeSelection || editor.selection || EditorAPI.fullRange(editor);

      const selectionRef = EditorAPI.rangeRef(editor, selection);

      EditorAPI.setTextPropertyAtRange(editor, selectionRef.current!, TextProperty.COLOR, DEFAULT_COLOR);
      EditorAPI.setTextPropertyAtRange(editor, selectionRef.current!, TextProperty.UNDERLINE, false);

      Transforms.unwrapNodes(editor, {
        at: selectionRef.current!,
        match: EditorAPI.isLink,
        mode: 'all',
        split: true,
        voids: true,
      });

      const nextFakeSelection = selectionRef.unref()!;

      if (fakeSelection) {
        editor.setFakeSelectionRange(nextFakeSelection);
      }
    },

    wrapLink: (editor: Editor, url: string, { pasted }: { pasted?: boolean } = {}): void => {
      let selection = editor.getFakeSelectionRange() || editor.selection || EditorAPI.fullRange(editor);
      const isFakeSelection = editor.getFakeSelectionRange();

      const selectionRef = EditorAPI.rangeRef(editor, selection);

      if (EditorAPI.link(editor)) {
        EditorAPI.unwrapLink(editor);
      }

      const isCollapsed = Range.isCollapsed(selection);

      if (isCollapsed || (pasted && editor.selection)) {
        Transforms.insertNodes(
          editor,
          {
            url,
            type: ElementType.LINK,
            children: [{ text: url, [TextProperty.COLOR]: LINK_COLOR, [TextProperty.UNDERLINE]: true }],
          },
          { at: selectionRef.current! }
        );
      } else {
        Transforms.wrapNodes(
          editor,
          {
            url,
            type: ElementType.LINK,
            children: [],
          },
          {
            at: selectionRef.current!,
            split: true,
            match: (node) => (Text.isText(node) && !isFakeSelection) || !!(node as Text)[EditorAPI.FAKE_SELECTION_PROPERTY_NAME],
          }
        );

        if (pasted) {
          Transforms.collapse(editor, { edge: 'end' });
        }

        EditorAPI.setTextPropertyAtRange(editor, selectionRef.current!, TextProperty.COLOR, LINK_COLOR);
        EditorAPI.setTextPropertyAtRange(editor, selectionRef.current!, TextProperty.UNDERLINE, true);
      }

      selection = selectionRef.unref()!;

      if (isFakeSelection) {
        editor.setFakeSelectionRange(selection);
      }
    },
  };

  return Object.assign(EditorAPI, LinksEditorAPI);
};
