import { normalize } from 'normal-store';
import React from 'react';

import { SlateTextInput } from '@/components/SlateInputs';

import { ChatIntentPromptFormProps } from '../types';

const ChatForm: React.FC<ChatIntentPromptFormProps> = ({ slots, autofocus, prompt: [prompt], onChange, placeholder }) => {
  const content = prompt?.content ?? null;
  const variables = React.useMemo(() => normalize(slots.map((slot) => ({ ...slot, isSlot: true }))), [slots]);

  return (
    <SlateTextInput
      value={content}
      onBlur={(content) => onChange([{ ...prompt, content }])}
      variables={variables}
      autofocus={autofocus}
      placeholder={placeholder}
      variablesWithSlots
      variablesCreatable={false}
    />
  );
};

export default ChatForm;
