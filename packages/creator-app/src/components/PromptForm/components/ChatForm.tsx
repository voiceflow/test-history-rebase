import { normalize } from 'normal-store';
import React from 'react';

import { SlateTextInput } from '@/components/SlateInputs';

import { ChatPromptFormProps } from '../types';

const ChatForm: React.FC<ChatPromptFormProps> = ({ slots, autofocus, prompt: [prompt], onChange, placeholder }) => {
  const content = prompt?.content ?? null;
  const variables = React.useMemo(() => normalize(slots), [slots]);

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
