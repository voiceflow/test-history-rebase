import { Divider } from '@voiceflow/ui';
import React from 'react';

import { SlateTextInput } from '@/components/SlateInputs';

import { ChatMessageProps } from '../../types';
import { DelayButton } from './components';

const ChatMessage: React.FC<ChatMessageProps> = ({ message, autoFocus, onChange }) => (
  <SlateTextInput
    value={message.content}
    onBlur={(content) => onChange({ content })}
    autofocus={autoFocus}
    extraToolbarButtons={
      <>
        <Divider isVertical height="15px" style={{ margin: 0 }} />
        <DelayButton delay={message.messageDelayMilliseconds} onChange={(delay) => onChange({ messageDelayMilliseconds: delay })} />
      </>
    }
  />
);

export default ChatMessage;
