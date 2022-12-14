import { Divider } from '@voiceflow/ui';
import React from 'react';

import { SlateTextInput } from '@/components/SlateInputs';
import { useActiveProjectTypeConfig } from '@/hooks';

import { ChatMessageProps } from '../../types';
import { DelayButton } from './components';

const ChatMessage: React.FC<ChatMessageProps> = ({ message, autoFocus, onChange }) => {
  const config = useActiveProjectTypeConfig();

  return (
    <SlateTextInput
      value={message.content}
      onBlur={(content) => onChange({ content })}
      options={config.project.chat.toolbarOptions}
      autofocus={autoFocus}
      extraToolbarButtons={
        config.project.chat.messageDelay && (
          <>
            <Divider isVertical height="15px" style={{ margin: 0 }} />
            <DelayButton delay={message.messageDelayMilliseconds} onChange={(delay) => onChange({ messageDelayMilliseconds: delay })} />
          </>
        )
      }
    />
  );
};

export default ChatMessage;
