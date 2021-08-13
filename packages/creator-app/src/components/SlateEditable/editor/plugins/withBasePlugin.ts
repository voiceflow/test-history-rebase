import { Descendant, Editor, Element, Node, Range, Transforms } from 'slate';

import type { EditorAPIType } from '../editorAPI';
import { PrismLanguage } from '../prism';
import type { DataProcessor, DataProcessorMiddleware, Plugin, ProcessorNext, TextProcessor, TextProcessorMiddleware } from './types';

export interface BasePluginEditor {
  prismLanguages(): PrismLanguage[];
  registerPrismLanguage(language: PrismLanguage): void;
  registerTextProcessingMiddleware: (middleware: TextProcessorMiddleware) => void;
  registerDataProcessingMiddleware: (middleware: DataProcessorMiddleware) => void;
}

export const withBasePlugin: Plugin = (EditorAPI: EditorAPIType) => (editor: Editor) => {
  const { insertData: originalInsertData, insertText: originalInsertText } = editor;

  const PRISM_LANGUAGES: PrismLanguage[] = [];

  const defaultProcessor = (value: Descendant[]) => value;

  const processor: { text: (text: string) => ProcessorNext; data: (data: DataTransfer) => ProcessorNext } = {
    text: () => defaultProcessor,
    data: () => defaultProcessor,
  };

  const rooTextProcessor: TextProcessor = (value: Descendant[], text: string) => processor.text(text)(value);

  const rooDataProcessor: DataProcessor = (value: Descendant[], data: DataTransfer) => processor.data(data)(value);

  const insertProcessedNodes = (nodes: Node | Node[]) => {
    if (!editor.selection) {
      return;
    }

    // If the cursor is at the end of an inline, move it outside of the inline before inserting
    if (Range.isCollapsed(editor.selection)) {
      const inline = EditorAPI.above<Element>(editor, { match: (n) => EditorAPI.isInline(editor, n), mode: 'highest' });

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
    const processedNodes = rooTextProcessor(nodes, text);

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
      const processedNodes = rooDataProcessor(nodes, data);

      if (!processedNodes || isNodesEqual(nodes, processedNodes)) {
        originalInsertData(data);
      } else {
        insertProcessedNodes(processedNodes);
      }
    }
  };

  const pluginsEditor: BasePluginEditor = {
    prismLanguages: () => PRISM_LANGUAGES,

    registerPrismLanguage: (language: PrismLanguage) => {
      PRISM_LANGUAGES.push(language);
    },

    registerTextProcessingMiddleware: (middleware: TextProcessorMiddleware) => {
      const next = middleware(rooTextProcessor);
      const originalProcessor = processor.text;

      processor.text = (text: string) => (value: Descendant[]) => next(originalProcessor(text))(value, text);
    },

    registerDataProcessingMiddleware: (middleware: DataProcessorMiddleware) => {
      const next = middleware(rooDataProcessor);
      const originalProcessor = processor.data;

      processor.data = (data: DataTransfer) => (value: Descendant[]) => next(originalProcessor(data))(value, data);
    },
  };

  return Object.assign(editor, pluginsEditor);
};
