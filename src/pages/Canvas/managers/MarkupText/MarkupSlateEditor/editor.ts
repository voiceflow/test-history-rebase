/* eslint-disable no-param-reassign */
import { Editor, Element, Node, Range, Text, Transforms } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';

import { Nullable } from '@/types';

import { BlockType, DEFAULT_LINK_COLOR, LeafProperty } from '../constants';
import type { MarkupEditor } from './index';

const MarkupSlateEditor = {
  ...Editor,
  ...ReactEditor,
  ...HistoryEditor,

  getEmptyState: (): Node[] => [{ children: [{ text: '' }] }],

  fullRange: (editor: MarkupEditor): Range => ({
    focus: MarkupSlateEditor.end(editor, []),
    anchor: MarkupSlateEditor.start(editor, []),
  }),

  isNewState: (nodes: Node[]): boolean =>
    nodes.length === 1 &&
    Element.isElement(nodes[0]) &&
    nodes[0].children.length === 1 &&
    Text.isText(nodes[0].children[0]) &&
    !nodes[0].children[0].text,

  serialize: (nodes: Node[]): string =>
    nodes
      .map((n) => Node.string(n))
      .join('\n')
      .trim(),

  setSelection: (editor: MarkupEditor, selection: Range): void => {
    Transforms.select(editor, selection);
  },

  removeFakeSelectionAndFocus(editor: MarkupEditor): void {
    let fakeSelectionRange = editor.getFakeSelectionRange();

    if (!fakeSelectionRange) {
      return;
    }

    const rangeRef = MarkupSlateEditor.rangeRef(editor, fakeSelectionRange);

    editor.removeFakeSelection();

    fakeSelectionRange = rangeRef.unref();

    if (fakeSelectionRange) {
      MarkupSlateEditor.focus(editor);
      MarkupSlateEditor.setSelection(editor, fakeSelectionRange);
    }
  },

  block: (editor: MarkupEditor): Nullable<Node> => {
    const fakeSelectionRange = editor.getFakeSelectionRange();

    if (fakeSelectionRange) {
      const [entry] = MarkupSlateEditor.nodes(editor, {
        at: fakeSelectionRange,
        match: (n) => !MarkupSlateEditor.isEditor(n) && Element.isElement(n),
      });

      return entry?.[0] ?? null;
    }

    if (!MarkupSlateEditor.isFocused(editor) || !editor.selection) {
      return editor.children[0] ?? null;
    }

    const [entry] = MarkupSlateEditor.nodes(editor, {
      at: editor.selection,
      match: (n) => !MarkupSlateEditor.isEditor(n) && Element.isElement(n),
    });

    return entry?.[0] ?? null;
  },

  blockProperty: <T>(editor: MarkupEditor, property: string): T | undefined => {
    const node = MarkupSlateEditor.block(editor);

    return node?.[property] as T | undefined;
  },

  isBlockPropertyActive: (editor: MarkupEditor, property: string, value: unknown): boolean =>
    MarkupSlateEditor.blockProperty(editor, property) === value,

  setBlockProperty: (editor: MarkupEditor, property: string, value: unknown): void => {
    if (!MarkupSlateEditor.isFocused(editor)) {
      Transforms.setNodes(editor, { [property]: value }, { at: MarkupSlateEditor.fullRange(editor), mode: 'highest' });
    } else {
      Transforms.setNodes(editor, { [property]: value }, { mode: 'highest' });
    }
  },

  firstLeaf: (node: Node): Nullable<Text> => {
    if (!node) {
      return null;
    }

    if (MarkupSlateEditor.isEditor(node) || Element.isElement(node)) {
      return MarkupSlateEditor.firstLeaf(node.children[0]);
    }

    return node;
  },

  leaf: (editor: MarkupEditor): Nullable<Node> => {
    const fakeSelectionRange = editor.getFakeSelectionRange();

    if (fakeSelectionRange) {
      const [entry] = MarkupSlateEditor.nodes(editor, { at: fakeSelectionRange, match: Text.isText });

      return entry?.[0] ?? null;
    }

    if (!MarkupSlateEditor.isFocused(editor) || !editor.selection) {
      return MarkupSlateEditor.firstLeaf(editor);
    }

    const [entry] = MarkupSlateEditor.nodes(editor, {
      at: editor.selection,
      match: Text.isText,
    });

    return entry?.[0] ?? null;
  },

  leafProperty: <T>(editor: MarkupEditor, property: string): T | undefined => {
    const leaf = MarkupSlateEditor.leaf(editor);

    return leaf?.[property] as T | undefined;
  },

  isLeafPropertyActive: (editor: MarkupEditor, property: string, value: unknown): boolean =>
    MarkupSlateEditor.leafProperty(editor, property) === value,

  setLeafProperty: (editor: MarkupEditor, property: string, value: unknown): void => {
    const fakeSelectionRange = editor.getFakeSelectionRange();

    if (fakeSelectionRange && Range.isCollapsed(fakeSelectionRange)) {
      editor.marks = { ...(Editor.marks(editor) ?? {}), [property]: value };

      editor.onChange();
      return;
    }

    if (fakeSelectionRange) {
      const rangeRef = MarkupSlateEditor.rangeRef(editor, fakeSelectionRange);

      MarkupSlateEditor.setLeafPropertyAtRange(editor, fakeSelectionRange, property, value);

      editor.setFakeSelectionRange(rangeRef.unref()!);
      return;
    }

    if (!MarkupSlateEditor.isFocused(editor) || !editor.selection) {
      editor.marks = { ...(Editor.marks(editor) ?? {}), [property]: value };

      Transforms.setNodes(editor, { [property]: value }, { at: MarkupSlateEditor.fullRange(editor), match: Text.isText, split: true });
      return;
    }

    editor.addMark(property, value);
  },

  setLeafPropertyAtRange: (editor: MarkupEditor, range: Range, property: string, value: unknown): void => {
    Transforms.setNodes(editor, { [property]: value }, { match: Text.isText, split: true, at: range });
  },

  unsetLeafPropertyAtAll: (editor: MarkupEditor, property: string): void => {
    Transforms.unsetNodes(editor, property, { match: Text.isText, at: MarkupSlateEditor.fullRange(editor) });
  },

  link: (editor: MarkupEditor): Nullable<Element> => {
    const [entry] = Editor.nodes(editor, {
      at: editor.getFakeSelectionRange() || editor.selection || MarkupSlateEditor.fullRange(editor),
      match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === BlockType.LINK,
    });

    return (entry?.[0] || null) as Nullable<Element>;
  },

  unwrapLink: (editor: MarkupEditor): void => {
    Transforms.unwrapNodes(editor, {
      at: editor.getFakeSelectionRange() || editor.selection || MarkupSlateEditor.fullRange(editor),
      match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === BlockType.LINK,
    });
  },

  wrapLink: (editor: MarkupEditor, url: string, { pasted }: { pasted?: boolean } = {}): void => {
    let selection = editor.getFakeSelectionRange() || editor.selection || MarkupSlateEditor.fullRange(editor);
    const isFakeSelection = editor.getFakeSelectionRange();

    const selectionRef = MarkupSlateEditor.rangeRef(editor, selection);

    if (MarkupSlateEditor.link(editor)) {
      MarkupSlateEditor.unwrapLink(editor);
    }

    const isCollapsed = Range.isCollapsed(selection);

    if (isCollapsed || (pasted && editor.selection)) {
      Transforms.insertNodes(
        editor,
        {
          url,
          type: BlockType.LINK,
          children: [{ text: url, [LeafProperty.COLOR]: DEFAULT_LINK_COLOR, [LeafProperty.UNDERLINE]: true }],
        },
        { at: selectionRef.current! }
      );
    } else {
      Transforms.wrapNodes(
        editor,
        {
          url,
          type: BlockType.LINK,
          children: [],
        },
        { at: selectionRef.current!, split: true, match: (node) => (Text.isText(node) && !isFakeSelection) || !!node.fakeSelection }
      );

      if (pasted) {
        Transforms.collapse(editor);
      }

      MarkupSlateEditor.setLeafPropertyAtRange(editor, selectionRef.current!, LeafProperty.COLOR, DEFAULT_LINK_COLOR);
      MarkupSlateEditor.setLeafPropertyAtRange(editor, selectionRef.current!, LeafProperty.UNDERLINE, true);
    }

    selection = selectionRef.unref()!;

    if (isFakeSelection) {
      editor.setFakeSelectionRange(selection);
    }
  },
};

export default MarkupSlateEditor;
