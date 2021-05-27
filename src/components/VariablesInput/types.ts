import { Nullable } from '@/types';

export type VariableInputRef = Nullable<{ focus: () => {}; blur: () => {}; getCurrentValue: () => { text: string }; getEditorState: Function }>;
