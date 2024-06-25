import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import SystemMessage from '@/components/SystemMessage';
import type { VoiceMessageRef } from '@/components/SystemMessage/types';

import type { VoicePromptProps, VoicePromptRef } from '../types';

const VoicePrompt = React.forwardRef<VoicePromptRef, VoicePromptProps>(({ message, onChange, ...props }, ref) => {
  const dialog = React.useMemo(() => Realtime.Adapters.voicePromptToSpeakDataAdapter.fromDB(message), [message]);
  const systemMessageRef = React.useRef<VoiceMessageRef>(null);

  React.useImperativeHandle(
    ref,
    () => ({
      getCurrentValue: () => {
        const systemMessage = systemMessageRef.current?.getCurrentValue();

        return systemMessage ? Realtime.Adapters.voicePromptToSpeakDataAdapter.toDB(systemMessage) : message;
      },
    }),
    [message]
  );

  return (
    <SystemMessage.Voice
      ref={systemMessageRef}
      message={dialog}
      onChange={(data) =>
        onChange(Realtime.Adapters.voicePromptToSpeakDataAdapter.toDB({ ...dialog, ...data } as Realtime.SpeakData))
      }
      {...props}
    />
  );
});

export default VoicePrompt;
