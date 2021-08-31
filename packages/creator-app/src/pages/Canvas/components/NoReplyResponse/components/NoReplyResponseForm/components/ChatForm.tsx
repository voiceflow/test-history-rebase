import { Types } from '@voiceflow/chat-types';
import React from 'react';

import Section from '@/components/Section';
import SlateEditableWithVariables from '@/components/SlateEditableWithVariables';
import { FormControl } from '@/pages/Canvas/components/Editor';

import { useFocusedNodeReprompt } from './hooks';

const ChatForm: React.FC = () => {
  const [reprompt, updateReprompt] = useFocusedNodeReprompt<Types.Prompt>();

  return (
    <Section>
      <FormControl>
        <SlateEditableWithVariables value={reprompt?.content} onBlur={(value) => updateReprompt({ content: value })} />
      </FormControl>
    </Section>
  );
};

export default ChatForm;
