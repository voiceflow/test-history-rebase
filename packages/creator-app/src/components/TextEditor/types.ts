import { EditorState } from 'draft-js';

import { PluginType } from './plugins';

export interface TextEditorRef {
  blur: () => {};
  focus: () => {};
  getEditorState: () => EditorState;
  getCurrentValue: () => { text: string };
}

export interface TextEditorBlurData {
  text: string;
  pluginsData: {
    [PluginType.VARIABLES]?: { variables: string[] };
  };
}

export interface TextEditorProps {
  id?: string;
  error?: boolean | null;
  value?: string | null;
  onBlur?: (data: TextEditorBlurData) => void;
  onFocus?: VoidFunction;
  onEmpty?: (isEmpty: boolean) => void;
  autoFocus?: boolean;
  placeholder?: string;
  rightAction?: React.ReactNode;
  onEnterPress?: (data: TextEditorBlurData) => void;
  newLineOnEnter?: boolean;
  skipBlurOnUnmount?: boolean;
  onEditorStateChange?: (editorState: EditorState) => void;
}
