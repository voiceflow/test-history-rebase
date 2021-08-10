/* eslint-disable no-param-reassign */

import { Descendant, Editor as SlateEditor, EditorInterface, Element, Node, Range, Text, Transforms } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';
import { PickByValue } from 'utility-types';

import { Nullable } from '@/types';

import { PluginsEditorAPI, withPluginsEditorAPI } from './plugins';
import { Editor } from './types';

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

  // selection and range

  fullRange(editor: Editor): Range;
  setSelection(editor: Editor, selection: Range): void;

  // element

  element(editor: Editor): Nullable<Element>;
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

  text(editor: Editor): Nullable<Text>;
  firstText(node: Descendant): Nullable<Text>;
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
  setTextPropertyAtRange<T extends TextPropertyKey>(editor: Editor, range: Range, property: T, value: Text[T] | undefined): void;
  unsetTextPropertyAtAll<T extends TextPropertyKey>(editor: Editor, property: T): void;
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

  getEmptyState: (): Descendant[] => [{ children: [{ text: '' }] }],

  // selection and range

  fullRange: (editor: Editor): Range => ({
    focus: EditorAPI.end(editor, []),
    anchor: EditorAPI.start(editor, []),
  }),

  setSelection: (editor: Editor, selection: Range): void => Transforms.select(editor, selection),

  // element

  element: (editor: Editor): Nullable<Element> => {
    const fakeSelectionRange = editor.getFakeSelectionRange();

    if (fakeSelectionRange) {
      const [entry] = EditorAPI.nodes<Element>(editor, {
        at: fakeSelectionRange,
        match: (n) => !EditorAPI.isEditor(n) && Element.isElement(n),
      });

      return entry?.[0] ?? null;
    }

    if (!EditorAPI.isFocused(editor) || !editor.selection) {
      return (editor.children[0] ?? null) as Nullable<Element>;
    }

    const [entry] = EditorAPI.nodes<Element>(editor, {
      at: editor.selection,
      match: (n) => !EditorAPI.isEditor(n) && Element.isElement(n),
    });

    return entry?.[0] ?? null;
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
    if (!EditorAPI.isFocused(editor)) {
      Transforms.setNodes(editor, { [property]: value }, { at: EditorAPI.fullRange(editor), mode: 'highest' });
    } else {
      Transforms.setNodes(editor, { [property]: value }, { mode: 'highest' });
    }
  },

  // text

  text: (editor: Editor): Nullable<Text> => {
    const fakeSelectionRange = editor.getFakeSelectionRange();

    if (fakeSelectionRange) {
      const [entry] = EditorAPI.nodes<Text>(editor, { at: fakeSelectionRange, match: Text.isText });

      return entry?.[0] ?? null;
    }

    if (!EditorAPI.isFocused(editor) || !editor.selection) {
      return EditorAPI.firstText(editor);
    }

    const [entry] = EditorAPI.nodes<Text>(editor, {
      at: editor.selection,
      match: Text.isText,
    });

    return entry?.[0] ?? null;
  },

  firstText: (node: Node): Nullable<Text> => {
    if (!node) {
      return null;
    }

    if (EditorAPI.isEditor(node) || Element.isElement(node)) {
      return EditorAPI.firstText(node.children[0]);
    }

    return node;
  },

  textProperty<T extends TextPropertyKey>(editor: Editor, property: T, defaultValue?: Text[T]): Text[T] | undefined {
    const text = EditorAPI.text(editor);

    return text?.[property] ?? defaultValue;
  },

  setTextProperty: <T extends TextPropertyKey>(editor: Editor, property: T, value: Text[T] | undefined): void => {
    const fakeSelectionRange = editor.getFakeSelectionRange();

    if (fakeSelectionRange && Range.isCollapsed(fakeSelectionRange)) {
      editor.marks = { ...(EditorAPI.marks(editor) ?? {}), [property]: value };

      editor.onChange();
      return;
    }

    if (fakeSelectionRange) {
      const rangeRef = EditorAPI.rangeRef(editor, fakeSelectionRange);

      EditorAPI.setTextPropertyAtRange(editor, fakeSelectionRange, property, value);

      editor.setFakeSelectionRange(rangeRef.unref()!);
      return;
    }

    if (!EditorAPI.isFocused(editor) || !editor.selection) {
      editor.marks = { ...(EditorAPI.marks(editor) ?? {}), [property]: value };

      Transforms.setNodes(editor, { [property]: value }, { at: EditorAPI.fullRange(editor), match: Text.isText, split: true });
      return;
    }

    editor.addMark(property, value);
  },

  toggleTextProperty: <T extends BooleanTextPropertyKey>(editor: Editor, property: T, value?: boolean): void => {
    const newValue = value ?? !EditorAPI.isTextPropertyActive<T>(editor, property, true as NonNullable<Text[T]>);

    EditorAPI.setTextProperty(editor, property, newValue);
  },

  isTextPropertyActive: <T extends TextPropertyKey>(
    editor: Editor,
    property: T,
    value: NonNullable<Text[T]>,
    { nullable }: { nullable?: boolean } = {}
  ): boolean => (nullable ? EditorAPI.textProperty(editor, property, value) : EditorAPI.textProperty(editor, property)) === value,

  setTextPropertyAtRange: <T extends TextPropertyKey>(editor: Editor, range: Range, property: T, value: Text[T] | undefined): void => {
    Transforms.setNodes(editor, { [property]: value }, { match: Text.isText, split: true, at: range });
  },

  unsetTextPropertyAtAll: <T extends TextPropertyKey>(editor: Editor, property: T): void => {
    Transforms.unsetNodes(editor, property, { match: Text.isText, at: EditorAPI.fullRange(editor) });
  },
};

export type EditorAPIType = BaseEditorAPI & PluginsEditorAPI;

const EditorAPI = withPluginsEditorAPI(BaseEditorAPI as EditorAPIType);

export default EditorAPI;
