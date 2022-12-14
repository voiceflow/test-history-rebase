import { normalize } from 'normal-store';
import React from 'react';

import { SlateTextInput } from '@/components/SlateInputs';
import { useActiveProjectTypeConfig } from '@/hooks';

import { ChatIntentPromptFormProps } from '../types';

const ChatForm: React.FC<ChatIntentPromptFormProps> = ({ slots, autofocus, prompt: [prompt], onChange, placeholder }) => {
  const content = prompt?.content ?? null;
  const variables = React.useMemo(() => normalize(slots.map((slot) => ({ ...slot, isSlot: true }))), [slots]);

  const config = useActiveProjectTypeConfig();

  return (
    <SlateTextInput
      value={content}
      onBlur={(content) => onChange([{ ...prompt, content }])}
      options={config.project.chat.toolbarOptions}
      variables={variables}
      autofocus={autofocus}
      placeholder={placeholder}
      variablesWithSlots
      variablesCreatable={false}
    />
  );
};

export default ChatForm;
