import { Nullable } from '@voiceflow/common';

export type VariableInputRef = Nullable<{ focus: () => {}; blur: () => {}; getCurrentValue: () => { text: string }; getEditorState: Function }>;
