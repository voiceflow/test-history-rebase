import * as Platform from '@voiceflow/platform-config';
import React from 'react';

import { SlateTextInput } from '@/components/SlateInputs';

export interface PromptInputTextEditorProps {
  value: Platform.Common.Chat.Models.Prompt.Model;
  onChange: (data: Platform.Common.Chat.Models.Prompt.Model) => void;
  placeholder?: string;
}

const PromptInputTextEditor: React.FC<PromptInputTextEditorProps> = ({ value, onChange, placeholder }) => (
  <SlateTextInput value={value.content} onBlur={(content) => onChange({ ...value, content })} autofocus placeholder={placeholder} />
);

export default PromptInputTextEditor;
