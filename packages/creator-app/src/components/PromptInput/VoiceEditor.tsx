import * as Platform from '@voiceflow/platform-config';
import React from 'react';

import SSMLWithVars from '@/components/SSMLWithVars';

export interface PromptInputVoiceEditorProps {
  value: Platform.Common.Voice.Models.Prompt.Model;
  onChange: (data: Platform.Common.Voice.Models.Prompt.Model) => void;
  placeholder?: string;
}

const PromptInputVoiceEditor: React.FC<PromptInputVoiceEditorProps> = ({ value, onChange, placeholder }) => (
  <SSMLWithVars
    icon={null}
    voice={value.voice}
    value={value.content}
    onBlur={({ text }) => onChange({ ...value, content: text })}
    placeholder={placeholder}
    onChangeVoice={(voice) => onChange({ ...value, voice })}
    skipBlurOnUnmount
  />
);

export default PromptInputVoiceEditor;
