/* eslint-disable no-param-reassign */

import { Nullable } from '@voiceflow/common';
import { Descendant, Editor as SlateEditor, EditorInterface, Element, Location, Node, Path, Range, Text, Transforms } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';
import { PickByValue } from 'utility-types';

import { PluginsEditorAPI, withPluginsEditorAPI } from './plugins';
import type { Editor } from './types';

// not using TextProperty and ElementProperty enums since plugins can add extra props
type TextPropertyKey = keyof Omit<Text, 'text'>;
type ElementPropertyKey = keyof Omit<Element, 'children' | 'type'>;
type BooleanTextPropertyKey = keyof PickByValue<Omit<Text, 'text'>, boolean | undefined>;

type ReactEditorType = typeof ReactEditor;
type HistoryEditorType = typeof HistoryEditor;

interface BaseEditorAPI extends EditorInterface, ReactEditorType, HistoryEditorType {
  serialize(nodes: Node[]): string;

  // state

  isNewState(nodes: Descendant[]): boolean;
  getEmptyState(): Descendant[];
  createTextState(text: string, options?: { textProperties?: Omit<Text, 'text'>; elementProperties?: Omit<Element, 'children'> }): Descendant[];

  // selection and range

  fullRange(editor: Editor): Range;
  setSelection(editor: Editor, target: Location): void;

  // element

  element(editor: Editor): Nullable<Element>;
  firstElement(node: Node): Nullable<Element>;
  elementProperty<T extends ElementPropertyKey>(editor: Editor, property: T): Element[T] | undefined;
  elementProperty<T extends ElementPropertyKey>(editor: Editor, property: T, defaultValue: NonNullable<Element[T]>): NonNullable<Element[T]>;
  setElementProperty<T extends ElementPropertyKey>(editor: Editor, property: T, value: Element[T] | undefined): void;
  isElementPropertyActive<T extends ElementPropertyKey>(
    editor: Editor,
    property: T,
    value: NonNullable<Element[T]>,
    options?: { nullable?: boolean }
  ): boolean;

  // text

  addMarkToAll: (editor: Editor, key: string, value: any) => void;
  removeMarkFromAll: (editor: Editor, key: string) => void;

  text(editor: Editor): Nullable<Text>;
  firstText(node: Node): Nullable<Text>;
  textProperty<T extends TextPropertyKey>(editor: Editor, property: T): Text[T] | undefined;
  textProperty<T extends TextPropertyKey>(editor: Editor, property: T, defaultValue: NonNullable<Text[T]>): NonNullable<Text[T]>;
  setTextProperty<T extends TextPropertyKey>(editor: Editor, property: T, value: Text[T] | undefined): void;
  toggleTextProperty<T extends BooleanTextPropertyKey>(editor: Editor, property: T): void;
  toggleTextProperty<T extends BooleanTextPropertyKey>(editor: Editor, property: T, value: boolean): void;
  isTextPropertyActive<T extends TextPropertyKey>(
    editor: Editor,
    property: T,
    value: NonNullable<Text[T]>,
    options?: { nullable?: boolean }
  ): boolean;
  setTextPropertyAtLocation<T extends TextPropertyKey>(editor: Editor, range: Location, property: T, value: Text[T] | undefined): void;
}

const BaseEditorAPI: BaseEditorAPI = {
  ...SlateEditor,
  ...ReactEditor,
  ...HistoryEditor,

  serialize: (nodes: Node[]) =>
    nodes
      .map((n) => Node.string(n))
      .join('\n')
      .trim(),

  // state

  isNewState: (nodes: Node[]): boolean =>
    nodes.length === 1 &&
    Element.isElement(nodes[0]) &&
    nodes[0].children.length === 1 &&
    Text.isText(nodes[0].children[0]) &&
    !nodes[0].children[0].text,

  getEmptyState: (): Descendant[] => BaseEditorAPI.createTextState(''),

  createTextState: (
    text: string,
    { textProperties, elementProperties }: { textProperties?: Omit<Text, 'text'>; elementProperties?: Omit<Element, 'children'> } = {}
  ): Descendant[] => [{ ...elementProperties, children: [{ ...textProperties, text }] }],

  // selection and range

  fullRange: (editor: Editor): Range => ({
    focus: EditorAPI.end(editor, []),
    anchor: EditorAPI.start(editor, []),
  }),

  setSelection: (editor: Editor, selection: Location): void => Transforms.select(editor, selection),

  // element

  element: (editor: Editor): Nullable<Element> => {
    const { selection } = editor;

    if (!selection) {
      return EditorAPI.firstElement(editor);
    }

    const [start, end] = Range.edges(selection);

    // path[0] gives us the index of the top-level block.
    let startTopLevelBlockIndex = start.path[0];
    const endTopLevelBlockIndex = end.path[0];

    while (startTopLevelBlockIndex <= endTopLevelBlockIndex) {
      const [node] = EditorAPI.node(editor, [startTopLevelBlockIndex]);

      if (Element.isElement(node)) {
        return node;
      }

      startTopLevelBlockIndex++;
    }

    return null;
  },

  firstElement: (node: Node): Nullable<Element> => {
    return (Element.isElement(node) || EditorAPI.isEditor(node)) && Element.isElement(node.children[0]) ? node.children[0] : null;
  },

  elementProperty: <T extends ElementPropertyKey>(editor: Editor, property: T, defaultValue?: NonNullable<Element[T]>): Element[T] | undefined => {
    const element = EditorAPI.element(editor);

    return element?.[property] ?? defaultValue;
  },

  isElementPropertyActive: <T extends ElementPropertyKey>(
    editor: Editor,
    property: T,
    value: NonNullable<Element[T]>,
    { nullable }: { nullable?: boolean } = {}
  ): boolean => (nullable ? EditorAPI.elementProperty(editor, property, value) : EditorAPI.elementProperty(editor, property)) === value,

  setElementProperty: <T extends ElementPropertyKey>(editor: Editor, property: T, value: Element[T] | undefined): void => {
    Transforms.setNodes(editor, { [property]: value }, { at: editor.selection ?? EditorAPI.fullRange(editor), mode: 'highest' });
  },

  // text

  addMarkToAll: (editor: Editor, key: string, value: any): void => {
    editor.marks = { ...(EditorAPI.marks(editor) ?? {}), [key]: value };

    const fullRange = EditorAPI.fullRange(editor);

    if (Range.isExpanded(fullRange)) {
      Transforms.setNodes(editor, { [key]: value }, { at: fullRange, match: Text.isText, split: true });
    }
  },

  removeMarkFromAll: (editor: Editor, key: string): void => {
    const marks = { ...EditorAPI.marks(editor) };

    delete marks[key as keyof Omit<Text, 'text'>];

    editor.marks = marks;

    const fullRange = EditorAPI.fullRange(editor);

    if (Range.isExpanded(fullRange)) {
      Transforms.unsetNodes(editor, key, { at: fullRange, match: Text.isText, split: true });
    }
  },

  addMark: (editor: Editor, key: string, value: any): void => {
    if (!editor.selection) {
      EditorAPI.addMarkToAll(editor, key, value);
    } else {
      SlateEditor.addMark(editor, key, value);
    }
  },

  removeMark: (editor: Editor, key: string): void => {
    if (!editor.selection) {
      EditorAPI.removeMarkFromAll(editor, key);
    } else {
      SlateEditor.removeMark(editor, key);
    }
  },

  text(editor: Editor): Nullable<Text> {
    const { selection } = editor;

    if (!selection) {
      return EditorAPI.firstText(editor);
    }

    if (Range.isExpanded(selection)) {
      const [entry] = EditorAPI.nodes(editor, { at: selection, match: Text.isText });

      return entry?.[0] ?? null;
    }

    const { anchor } = selection;
    const { path } = anchor;

    let [node] = EditorAPI.leaf(editor, path);

    if (anchor.offset === 0) {
      const prev = EditorAPI.previous(editor, { at: path, match: Text.isText });
      const block = EditorAPI.above<Element>(editor, { match: (n) => Element.isElement(n) && EditorAPI.isBlock(editor, n) });

      if (prev && block) {
        const [prevNode, prevPath] = prev;
        const [, blockPath] = block;

        if (Path.isAncestor(blockPath, prevPath)) {
          node = prevNode as Text;
        }
      }
    }

    return node;
  },

  firstText: (node: Node): Nullable<Text> => {
    if (Text.isText(node)) {
      return node;
    }

    for (const child of node.children) {
      const text = EditorAPI.firstText(child);

      if (text) {
        return text;
      }
    }

    return null;
  },

  textProperty<T extends TextPropertyKey>(editor: Editor, property: T, defaultValue?: Text[T]): Text[T] | undefined {
    if (!editor.selection) {
      return EditorAPI.text(editor)?.[property] ?? defaultValue;
    }

    const marks = EditorAPI.marks(editor);

    return (marks?.[property] as Text[T]) ?? defaultValue;
  },

  setTextProperty: <T extends TextPropertyKey>(editor: Editor, property: T, value: Text[T] | undefined): void => {
    EditorAPI.addMark(editor, property, value);
  },

  toggleTextProperty: <T extends BooleanTextPropertyKey>(editor: Editor, property: T, value?: boolean): void => {
    const newValue = value ?? !EditorAPI.isTextPropertyActive<T>(editor, property, true as NonNullable<Text[T]>);

    EditorAPI.setTextProperty(editor, property, newValue as Text[T]);
  },

  isTextPropertyActive: <T extends TextPropertyKey>(
    editor: Editor,
    property: T,
    value: NonNullable<Text[T]>,
    { nullable }: { nullable?: boolean } = {}
  ): boolean => (nullable ? EditorAPI.textProperty(editor, property, value) : EditorAPI.textProperty(editor, property)) === value,

  setTextPropertyAtLocation: <T extends TextPropertyKey>(editor: Editor, location: Location, property: T, value: Text[T] | undefined): void => {
    Transforms.setNodes(editor, { [property]: value }, { match: Text.isText, split: true, at: location });
  },
};

export type EditorAPIType = BaseEditorAPI & PluginsEditorAPI;

const EditorAPI = withPluginsEditorAPI(BaseEditorAPI as EditorAPIType);

export default EditorAPI;
