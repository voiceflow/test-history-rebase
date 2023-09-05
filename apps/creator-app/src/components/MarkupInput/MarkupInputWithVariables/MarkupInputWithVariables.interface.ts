import type { Markup } from '@voiceflow/sdk-logux-designer';
import type { SlateEditor } from '@voiceflow/ui-next';
import type { ISlateEditor } from '@voiceflow/ui-next/build/cjs/components/Inputs/SlateEditor';

export interface IMarkupInputWithVariables extends Omit<ISlateEditor, 'value' | 'onBlur' | 'onFocus' | 'placeholder' | 'onValueChange' | 'editor'> {
  value: Markup;
  onBlur?: VoidFunction;
  onFocus?: VoidFunction;
  plugins?: SlateEditor.PluginType[];
  onTouched?: (isTouched: boolean) => void;
  className?: string;
  placeholder?: string | { default: string; focused: string };
  onValueEmpty?: (isEmpty: boolean) => void;
  pluginOptions?: SlateEditor.PluginsOptions;
  onValueChange: (value: Markup) => void;
  autoFocusIfEmpty?: boolean;
}
