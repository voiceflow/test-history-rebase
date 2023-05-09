import { serializeToText } from '@voiceflow/slate-serializer/text';
import { Descendant, Editor, Element, Node, Range, Transforms } from 'slate';

import type { EditorAPIType } from '../editorAPI';
import { PrismLanguage } from '../prism';
import type {
  DataProcessor,
  DataProcessorMiddleware,
  DataProcessorOptions,
  Plugin,
  ProcessorNext,
  TextProcessor,
  TextProcessorMiddleware,
  TextProcessorOptions,
} from './types';

export interface BasePluginEditor {
  processText(options: TextProcessorOptions): Descendant[];
  isEmptyState(value: Descendant[]): boolean;
  prismLanguages(): PrismLanguage[];
  registerPrismLanguage(language: PrismLanguage): void;
  registerTextProcessingMiddleware: (middleware: TextProcessorMiddleware) => void;
  registerDataProcessingMiddleware: (middleware: DataProcessorMiddleware) => void;
}

export const withBasePlugin: Plugin = (EditorAPI: EditorAPIType) => (editor: Editor) => {
  const { onChange: originalOnChange, insertData: originalInsertData, insertText: originalInsertText } = editor;

  const PRISM_LANGUAGES: PrismLanguage[] = [];

  const defaultProcessor = (value: Descendant[]) => value;

  let prevContentEmpty: null | boolean = null;

  const processor: { text: (options: TextProcessorOptions) => ProcessorNext; data: (options: DataProcessorOptions) => ProcessorNext } = {
    text: () => defaultProcessor,
    data: () => defaultProcessor,
  };

  const rooTextProcessor: TextProcessor = (value: Descendant[], options: TextProcessorOptions) => processor.text(options)(value);

  const rooDataProcessor: DataProcessor = (value: Descendant[], options: DataProcessorOptions) => processor.data(options)(value);

  const insertProcessedNodes = (nodes: Node | Node[]) => {
    if (!editor.selection) {
      return;
    }

    // If the cursor is at the end of an inline, move it outside of the inline before inserting
    if (Range.isCollapsed(editor.selection)) {
      const inline = EditorAPI.above<Element>(editor, { match: (n) => Element.isElement(n) && EditorAPI.isInline(editor, n), mode: 'highest' });

      if (inline) {
        const [, inlinePath] = inline;

        if (EditorAPI.isEnd(editor, editor.selection.anchor, inlinePath)) {
          const point = Editor.after(editor, inlinePath);

          Transforms.setSelection(editor, { anchor: point, focus: point });
        }
      }
    }

    Transforms.insertNodes(editor, nodes, { at: editor.selection, select: true });
  };

  const isNodesEqual = (nodes: Node[], processedNodes: Node[]) =>
    nodes.length === processedNodes.length && nodes.every((node, index) => node === processedNodes[index]);

  editor.onChange = () => {
    originalOnChange();

    if (prevContentEmpty === false && EditorAPI.isNewState(editor.children)) {
      prevContentEmpty = true;

      requestAnimationFrame(() => {
        const marks = EditorAPI.marks(editor);

        if (!marks) return;

        EditorAPI.withoutNormalizing(editor, () => {
          Object.keys(marks).forEach((mark) => EditorAPI.removeMark(editor, mark));
        });
      });
    } else {
      prevContentEmpty = EditorAPI.isNewState(editor.children);
    }
  };

  editor.insertText = (text: string) => {
    // insert text s called on paste and every keypress, so skipping keypress
    if (text.length <= 1) {
      originalInsertText(text);
      return;
    }

    const { selection } = editor;

    if (!selection) {
      return;
    }

    const nodes: Node[] = [{ text }];
    const processedNodes = rooTextProcessor(nodes, { pasted: true, originalText: text });

    if (!processedNodes || isNodesEqual(nodes, processedNodes)) {
      originalInsertText(text);
    } else {
      insertProcessedNodes(processedNodes);
    }
  };

  editor.insertData = (data: DataTransfer) => {
    const fragment = data.getData('application/x-slate-fragment');

    if (fragment) {
      const decoded = decodeURIComponent(window.atob(fragment));
      const parsed = JSON.parse(decoded) as Node[];
      editor.insertFragment(parsed);
      return;
    }

    const text = data.getData('text/plain');

    if (text) {
      editor.insertText(text);
    } else {
      const nodes: Node[] = [];
      const processedNodes = rooDataProcessor(nodes, { pasted: true, originalData: data });

      if (!processedNodes || isNodesEqual(nodes, processedNodes)) {
        originalInsertData(data);
      } else {
        insertProcessedNodes(processedNodes);
      }
    }
  };

  const pluginsEditor: BasePluginEditor = {
    processText: (options) => rooTextProcessor([{ text: options.originalText }], options),

    isEmptyState: (value: Descendant[]): boolean => value.every((node) => !serializeToText([node]).trim()),

    prismLanguages: () => PRISM_LANGUAGES,

    registerPrismLanguage: (language: PrismLanguage) => {
      PRISM_LANGUAGES.push(language);
    },

    registerTextProcessingMiddleware: (middleware: TextProcessorMiddleware) => {
      const next = middleware(rooTextProcessor);
      const originalProcessor = processor.text;

      processor.text = (options: TextProcessorOptions) => (value: Descendant[]) => next(originalProcessor(options))(value, options);
    },

    registerDataProcessingMiddleware: (middleware: DataProcessorMiddleware) => {
      const next = middleware(rooDataProcessor);
      const originalProcessor = processor.data;

      processor.data = (options: DataProcessorOptions) => (value: Descendant[]) => next(originalProcessor(options))(value, options);
    },
  };

  return Object.assign(editor, pluginsEditor);
};
