import { ChatModels } from '@voiceflow/chat-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { normalize } from 'normal-store';
import React from 'react';

import SlateEditableWithVariables from '@/components/SlateEditableWithVariables';

interface ChatPromptFormProps {
  slots: Realtime.Slot[];
  prompt: ChatModels.Prompt[];
  onChange: (prompt: ChatModels.Prompt[]) => void;
  placeholder: string;
}

const ChatPromptForm: React.FC<ChatPromptFormProps> = ({ slots, prompt: [prompt], onChange, placeholder }) => {
  const content = prompt?.content ?? null;

  const variables = React.useMemo(() => normalize(slots), [slots]);

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
