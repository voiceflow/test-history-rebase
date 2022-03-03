import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceModels } from '@voiceflow/voice-types';
import React from 'react';

import SSMLWithSlots from '@/components/SSMLWithSlots';

interface VoicePromptFormProps {
  slots: Realtime.Slot[];
  prompt: VoiceModels.IntentPrompt<string>[];
  onChange: (prompt: VoiceModels.IntentPrompt<string>[]) => void;
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
