import type { IInput, SlateEditor } from '@voiceflow/ui-next';

import type { IMarkupInputWithVariables } from '@/components/MarkupInput/MarkupInputWithVariables/MarkupInputWithVariables.interface';

export interface IInputWithVariables
  extends Omit<IMarkupInputWithVariables, 'placeholder' | 'header' | 'footer' | 'pluginOptions' | 'EditableContainer' | 'editor' | 'plugins'> {
  error?: boolean;
  variant?: IInput['variant'];
  fullWidth?: boolean;
  singleLine?: boolean;
  placeholder?: string;
  canCreateVariables?: boolean;
  variablesMap?: Record<string, SlateEditor.VariableItem>;
}
