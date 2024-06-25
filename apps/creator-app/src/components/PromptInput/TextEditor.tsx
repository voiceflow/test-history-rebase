import type * as Platform from '@voiceflow/platform-config';
import React from 'react';

import { SlateTextInput } from '@/components/SlateInputs';
import { useActiveProjectTypeConfig } from '@/hooks/platformConfig';

export interface PromptInputTextEditorProps {
  value: Platform.Common.Chat.Models.Prompt.Model;
  onChange: (data: Platform.Common.Chat.Models.Prompt.Model) => void;
  placeholder?: string;
}

const PromptInputTextEditor: React.FC<PromptInputTextEditorProps> = ({ value, onChange, placeholder }) => {
  const config = useActiveProjectTypeConfig();

  return (
    <SlateTextInput
      value={value.content}
      onBlur={(content) => onChange({ ...value, content })}
      options={config.project.chat.toolbarOptions}
      autofocus
      placeholder={placeholder}
    />
  );
};

export default PromptInputTextEditor;
