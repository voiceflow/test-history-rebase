import { normalize } from 'normal-store';
import React from 'react';

import { SlateTextInput } from '@/components/SlateInputs';
import { useActiveProjectTypeConfig } from '@/hooks';

import type { ChatEntityPromptProps } from '../types';

const ChatEntityPrompt: React.FC<ChatEntityPromptProps> = ({
  slots,
  prompt,
  autofocus,
  isActive,
  onChange,
  placeholder,
}) => {
  const content = prompt?.content ?? null;
  const variables = React.useMemo(() => normalize(slots.map((slot) => ({ ...slot, isSlot: true }))), [slots]);

  const config = useActiveProjectTypeConfig();

  return (
    <SlateTextInput
      value={content}
      onBlur={(content) => onChange({ content })}
      options={config.project.chat.toolbarOptions}
      isActive={isActive}
      variables={variables}
      autofocus={autofocus}
      placeholder={placeholder}
      variablesWithSlots
      variablesCreatable={false}
    />
  );
};

export default ChatEntityPrompt;
