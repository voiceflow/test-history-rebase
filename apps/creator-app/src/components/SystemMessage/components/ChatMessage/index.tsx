import { Divider } from '@voiceflow/ui';
import React from 'react';

import type { SlateEditableRef } from '@/components/SlateEditable';
import { SlateTextInput } from '@/components/SlateInputs';
import { useActiveProjectTypeConfig } from '@/hooks';

import type { ChatMessageProps, ChatMessageRef } from '../../types';
import { DelayButton } from './components';

const ChatMessage = React.forwardRef<ChatMessageRef, ChatMessageProps>(
  ({ message, placeholder, autoFocus, onEmpty, onChange, readOnly, isActive }, ref) => {
    const config = useActiveProjectTypeConfig();
    const slateRef = React.useRef<SlateEditableRef>(null);

    React.useImperativeHandle(
      ref,
      () => ({
        getCurrentValue: () => ({ ...message, content: slateRef.current?.getContent() ?? message.content }),
      }),
      [message]
    );

    return (
      <SlateTextInput
        ref={slateRef}
        value={message.content}
        onBlur={(content) => onChange({ content })}
        options={config.project.chat.toolbarOptions}
        onEmpty={onEmpty}
        readOnly={readOnly}
        isActive={isActive}
        autofocus={autoFocus}
        placeholder={placeholder}
        extraToolbarButtons={
          config.project.chat.messageDelay && (
            <>
              <Divider height={15} offset={4} isVertical />
              <DelayButton
                delay={message.messageDelayMilliseconds}
                onChange={(delay) => onChange({ messageDelayMilliseconds: delay })}
              />
            </>
          )
        }
      />
    );
  }
);

export default ChatMessage;
