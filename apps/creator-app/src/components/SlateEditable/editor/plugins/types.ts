import type { Descendant, Editor, NodeEntry, Range } from 'slate';

import type { EditorAPIType } from '../editorAPI';

interface BaseProcessorOptions {
  pasted?: boolean;
}
export interface TextProcessorOptions extends BaseProcessorOptions {
  originalText: string;
}
export interface DataProcessorOptions extends BaseProcessorOptions {
  originalData: DataTransfer;
}

export type ProcessorNext = (value: Descendant[]) => Descendant[];

export type TextProcessor = (value: Descendant[], options: TextProcessorOptions) => Descendant[];

export type DataProcessor = (value: Descendant[], options: DataProcessorOptions) => Descendant[];

export type TextProcessorMiddleware = (process: TextProcessor) => (next: ProcessorNext) => TextProcessor;

export type DataProcessorMiddleware = (process: DataProcessor) => (next: ProcessorNext) => DataProcessor;

export type PluginDecorate = (entry: NodeEntry) => Range[];

export type Plugin = (EditorAPI: EditorAPIType) => (editor: Editor) => Editor;

export type APIPlugin = (EditorAPI: EditorAPIType) => EditorAPIType;
