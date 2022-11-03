import { BaseNode } from '@voiceflow/base-types';
import React from 'react';

import { SlateTextInput } from '@/components/SlateInputs';

export interface PromptInputTextEditorProps {
  value: BaseNode.Text.TextData | undefined | null;
  onUpdate: (data: Partial<BaseNode.Text.TextData>) => void;
  placeholder?: string;
}

const PromptInputTextEditor: React.FC<PromptInputTextEditorProps> = ({ value, onUpdate, placeholder }) => {
  return <SlateTextInput value={value?.content ?? undefined} onBlur={(value) => onUpdate({ content: value })} autofocus placeholder={placeholder} />;
};

export default PromptInputTextEditor;
