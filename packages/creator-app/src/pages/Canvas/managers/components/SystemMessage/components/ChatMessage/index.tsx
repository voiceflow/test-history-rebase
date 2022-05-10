import React from 'react';

import Divider from '@/components/Divider';
import { SlateTextInput } from '@/components/SlateInputs';

import { ChatMessageProps } from '../../types';
import { DelayButton } from './components';

const ChatMessage: React.FC<ChatMessageProps> = ({ message, autoFocus, onChange }) => (
  <SlateTextInput
    value={message.content}
    onBlur={(content) => onChange({ content })}
    // eslint-disable-next-line jsx-a11y/no-autofocus
    autoFocus={autoFocus}
    extraToolbarButtons={
      <>
        <Divider isVertical height="15px" style={{ margin: 0 }} />
        <DelayButton delay={message.messageDelayMilliseconds} onChange={(delay) => onChange({ messageDelayMilliseconds: delay })} />
      </>
    }
  />
);

export default ChatMessage;
