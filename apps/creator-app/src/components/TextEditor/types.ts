import { InputTypes, SvgIconTypes } from '@voiceflow/ui';
import { EditorState } from 'draft-js';

import { PluginType } from './plugins';

export interface TextEditorBlurData {
  text: string;
  pluginsData: {
    [PluginType.VARIABLES]?: { variables: string[] };
  };
}

export interface TextEditorRef {
  blur: VoidFunction;
  clear: VoidFunction;
  focus: VoidFunction;
  select: VoidFunction;
  forceUpdate: VoidFunction;
  getEditorState: () => EditorState;
  getCurrentValue: () => TextEditorBlurData;
  forceFocusToTheEnd: VoidFunction;
}

export interface TextEditorVariable {
  id: string;
  name: string;
  isVariable?: boolean;
}

export interface VariablesPluginsData {
  space?: boolean;
  creatable?: boolean;
  variables: TextEditorVariable[];
  characters?: string;
  onAddVariable?: (name: string) => Promise<TextEditorVariable | null>;
  onVariableAdded?: (data: { name: string }) => void;
  createInputPlaceholder?: string;
}

export interface TextEditorProps {
  id?: string;
  icon?: SvgIconTypes.Icon;
  error?: boolean | null;
  value?: string | null;
  onBlur?: (data: TextEditorBlurData) => void;
  variant?: InputTypes.Variant;
  onFocus?: VoidFunction;
  onEmpty?: (isEmpty: boolean) => void;
  readOnly?: boolean;
  isActive?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  iconProps?: Omit<SvgIconTypes.Props, 'icon'>;
  leftAction?: React.ReactNode;
  placeholder?: string;
  rightAction?: React.ReactNode;
  pluginsTypes?: PluginType[];
  pluginsProps?: { [PluginType.VARIABLES]?: VariablesPluginsData };
  onEnterPress?: (data: TextEditorBlurData) => void;
  newLineOnEnter?: boolean;
  skipBlurOnUnmount?: boolean;
  onEditorStateChange?: (editorState: EditorState) => void;
}
