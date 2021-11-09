import * as Realtime from '@voiceflow/realtime-sdk';
import { Types } from '@voiceflow/voice-types';
import React from 'react';

import SSMLWithSlots from '@/components/SSMLWithSlots';

interface VoicePromptFormProps {
  slots: Realtime.Slot[];
  prompt: Types.IntentPrompt<string>[];
  onChange: (prompt: Types.IntentPrompt<string>[]) => void;
  placeholder: string;
}

const VoicePromptForm: React.FC<VoicePromptFormProps> = ({ slots, prompt: [prompt], onChange, placeholder }) => {
  const voice = prompt?.voice ?? '';
  const text = prompt?.text ?? '';

  return (
    <SSMLWithSlots
      icon={null}
      voice={voice}
      slots={slots}
      value={text}
      onBlur={(ssmValue) => onChange([{ ...ssmValue, voice }])}
      placeholder={placeholder}
      onChangeVoice={(voice) => onChange([{ ...prompt, voice }])}
    />
  );
};

export default VoicePromptForm;
