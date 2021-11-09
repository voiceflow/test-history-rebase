import { Types } from '@voiceflow/chat-types';
import { Utils } from '@voiceflow/common';
import React from 'react';

import SlateEditableWithVariables from '@/components/SlateEditableWithVariables';
import { Slot } from '@/models';

interface ChatPromptFormProps {
  slots: Slot[];
  prompt: Types.Prompt[];
  onChange: (prompt: Types.Prompt[]) => void;
  placeholder: string;
}

const ChatPromptForm: React.FC<ChatPromptFormProps> = ({ slots, prompt: [prompt], onChange, placeholder }) => {
  const content = prompt?.content ?? null;

  const variables = React.useMemo(() => Utils.normalized.normalize(slots), [slots]);

  return (
    <SlateEditableWithVariables
      value={content}
      onBlur={(content) => onChange([{ ...prompt, content }])}
      variables={variables}
      placeholder={placeholder}
      variablesWithSlots
      variablesCreatable={false}
    />
  );
};

export default ChatPromptForm;
