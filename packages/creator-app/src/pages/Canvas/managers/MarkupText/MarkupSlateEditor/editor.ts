/* eslint-disable no-param-reassign */
import { Editor, Element, Node, Range, Text, Transforms } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';

import { Nullable } from '@/types';

import { DEFAULT_COLOR, DEFAULT_LINK_COLOR, ElementType, FAKE_SELECTION_PROPERTY_NAME, TextProperty } from '../constants';
import { LinkElement } from './types';

type TextPropertyKey = keyof Omit<Text, 'text'>;
type ElementPropertyKey = keyof Omit<Element, 'children' | 'type'>;

const MarkupSlateEditor = {
  ...Editor,
  ...ReactEditor,
  ...HistoryEditor,

  isLink: (node: Node): node is LinkElement => !Editor.isEditor(node) && Element.isElement(node) && node.type === ElementType.LINK,

  getEmptyState: (): Element[] => [{ children: [{ text: '' }] }],

  fullRange: (editor: Editor): Range => ({
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

  setSelection: (editor: Editor, selection: Range): void => {
    Transforms.select(editor, selection);
  },

  removeFakeSelectionAndFocus(editor: Editor): void {
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

  element: (editor: Editor): Nullable<Element> => {
    const fakeSelectionRange = editor.getFakeSelectionRange();

    if (fakeSelectionRange) {
      const [entry] = MarkupSlateEditor.nodes<Element>(editor, {
        at: fakeSelectionRange,
        match: (n) => !MarkupSlateEditor.isEditor(n) && Element.isElement(n),
      });

      return entry?.[0] ?? null;
    }

    if (!MarkupSlateEditor.isFocused(editor) || !editor.selection) {
      return (editor.children[0] ?? null) as Nullable<Element>;
    }

    const [entry] = MarkupSlateEditor.nodes<Element>(editor, {
      at: editor.selection,
      match: (n) => !MarkupSlateEditor.isEditor(n) && Element.isElement(n),
    });

    return entry?.[0] ?? null;
  },

  elementProperty: <T extends ElementPropertyKey>(editor: Editor, property: T): Element[T] | undefined => {
    const element = MarkupSlateEditor.element(editor);

    return element?.[property];
  },

  isElementPropertyActive: <T extends ElementPropertyKey>(editor: Editor, property: T, value: Element[T] | undefined): boolean =>
    MarkupSlateEditor.elementProperty(editor, property) === value,

  setElementProperty: <T extends ElementPropertyKey>(editor: Editor, property: T, value: Element[T] | undefined): void => {
    if (!MarkupSlateEditor.isFocused(editor)) {
      Transforms.setNodes(editor, { [property]: value }, { at: MarkupSlateEditor.fullRange(editor), mode: 'highest' });
    } else {
      Transforms.setNodes(editor, { [property]: value }, { mode: 'highest' });
    }
  },

  firstText: (node: Node): Nullable<Text> => {
    if (!node) {
      return null;
    }

    if (MarkupSlateEditor.isEditor(node) || Element.isElement(node)) {
      return MarkupSlateEditor.firstText(node.children[0]);
    }

    return node;
  },

  text: (editor: Editor): Nullable<Text> => {
    const fakeSelectionRange = editor.getFakeSelectionRange();

    if (fakeSelectionRange) {
      const [entry] = MarkupSlateEditor.nodes<Text>(editor, { at: fakeSelectionRange, match: Text.isText });

      return entry?.[0] ?? null;
    }

    if (!MarkupSlateEditor.isFocused(editor) || !editor.selection) {
      return MarkupSlateEditor.firstText(editor);
    }

    const [entry] = MarkupSlateEditor.nodes<Text>(editor, {
      at: editor.selection,
      match: Text.isText,
    });

    return entry?.[0] ?? null;
  },

  textProperty: <T extends TextPropertyKey>(editor: Editor, property: T): Text[T] | undefined => {
    const text = MarkupSlateEditor.text(editor);

    return text?.[property];
  },

  isTextPropertyActive: <T extends TextPropertyKey>(editor: Editor, property: T, value: Text[T] | undefined): boolean =>
    MarkupSlateEditor.textProperty(editor, property) === value,

  setTextProperty: <T extends TextPropertyKey>(editor: Editor, property: T, value: Text[T] | undefined): void => {
    const fakeSelectionRange = editor.getFakeSelectionRange();

    if (fakeSelectionRange && Range.isCollapsed(fakeSelectionRange)) {
      editor.marks = { ...(Editor.marks(editor) ?? {}), [property]: value };

      editor.onChange();
      return;
    }

    if (fakeSelectionRange) {
      const rangeRef = MarkupSlateEditor.rangeRef(editor, fakeSelectionRange);

      MarkupSlateEditor.setTextPropertyAtRange(editor, fakeSelectionRange, property, value);

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

  setTextPropertyAtRange: <T extends TextPropertyKey>(editor: Editor, range: Range, property: T, value: Text[T] | undefined): void => {
    Transforms.setNodes(editor, { [property]: value }, { match: Text.isText, split: true, at: range });
  },

  unsetTextPropertyAtAll: <T extends TextPropertyKey>(editor: Editor, property: T): void => {
    Transforms.unsetNodes(editor, property, { match: Text.isText, at: MarkupSlateEditor.fullRange(editor) });
  },

  link: (editor: Editor): Nullable<LinkElement> => {
    const [entry] = Editor.nodes(editor, {
      at: editor.getFakeSelectionRange() || editor.selection || MarkupSlateEditor.fullRange(editor),
      match: MarkupSlateEditor.isLink,
    });

    return entry?.[0] || null;
  },

  unwrapLink: (editor: Editor): void => {
    const fakeSelection = editor.getFakeSelectionRange();
    const selection = fakeSelection || editor.selection || MarkupSlateEditor.fullRange(editor);

    const selectionRef = MarkupSlateEditor.rangeRef(editor, selection);

    MarkupSlateEditor.setTextPropertyAtRange(editor, selectionRef.current!, TextProperty.COLOR, DEFAULT_COLOR);
    MarkupSlateEditor.setTextPropertyAtRange(editor, selectionRef.current!, TextProperty.UNDERLINE, false);

    Transforms.unwrapNodes(editor, {
      at: selectionRef.current!,
      match: MarkupSlateEditor.isLink,
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
          type: ElementType.LINK,
          children: [{ text: url, [TextProperty.COLOR]: DEFAULT_LINK_COLOR, [TextProperty.UNDERLINE]: true }],
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
          match: (node) => (Text.isText(node) && !isFakeSelection) || !!(node as Text)[FAKE_SELECTION_PROPERTY_NAME],
        }
      );

      if (pasted) {
        Transforms.collapse(editor);
      }

      MarkupSlateEditor.setTextPropertyAtRange(editor, selectionRef.current!, TextProperty.COLOR, DEFAULT_LINK_COLOR);
      MarkupSlateEditor.setTextPropertyAtRange(editor, selectionRef.current!, TextProperty.UNDERLINE, true);
    }

    selection = selectionRef.unref()!;

    if (isFakeSelection) {
      editor.setFakeSelectionRange(selection);
    }
  },
};

export default MarkupSlateEditor;
