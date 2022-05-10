import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { SystemMessage } from '@/pages/Canvas/managers/components';

import { VoicePromptProps } from '../types';

const VoicePrompt: React.FC<VoicePromptProps> = ({ message, onChange, ...props }) => {
  const dialog = React.useMemo(() => Realtime.Adapters.voicePromptToSpeakDataAdapter.fromDB(message), [message]);

  return (
    <SystemMessage.Voice
      message={dialog}
      onChange={(data) => onChange(Realtime.Adapters.voicePromptToSpeakDataAdapter.toDB({ ...dialog, ...data } as Realtime.SpeakData))}
      {...props}
    />
  );
};

export default VoicePrompt;
