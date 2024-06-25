import type { Normalized, Nullish } from '@voiceflow/common';
import type { Base } from '@voiceflow/platform-config';

import type { SlateEditableProps, SlatePluginType, SlateVariableItem } from '@/components/SlateEditable';

import type { ToolbarIcons } from '../types';
import type { SlateBaseInputProps } from './SlateBaseInput';

export type { SlateValue } from '@/components/SlateEditable';

export interface SlateInputProps extends Omit<SlateBaseInputProps, 'value' | 'editor' | 'onChange'> {
  value?: Nullish<SlateEditableProps['value']>;
  onChange?: Nullish<SlateEditableProps['onChange']>;
}

export interface SlateTextInputProps extends Omit<SlateInputProps, 'topToolbar' | 'pluginsOptions'> {
  icons?: ToolbarIcons;
  options?: Base.Project.Chat.ToolbarOption[];
  onEmpty?: (isEmpty: boolean) => void;
  variables?: Normalized<SlateVariableItem>;
  pluginsOptions?: Nullish<Omit<SlateEditableProps['pluginsOptions'], SlatePluginType.VARIABLES>>;
  variablesCreatable?: boolean;
  variablesWithSlots?: boolean;
  extraToolbarButtons?: React.ReactNode;
}
