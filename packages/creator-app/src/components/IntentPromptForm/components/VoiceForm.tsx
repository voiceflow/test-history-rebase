import React from 'react';

import SSMLWithSlots from '@/components/SSMLWithSlots';

import { VoiceIntentPromptFormProps } from '../types';

const VoiceForm: React.FC<VoiceIntentPromptFormProps> = ({ autofocus, slots, prompt: [prompt], onChange, placeholder }) => {
  const text = prompt?.text ?? '';
  const voice = prompt?.voice ?? '';

  return (
    <SSMLWithSlots
      icon={null}
      voice={voice}
      slots={slots}
      value={text}
      onBlur={(ssmlValue) => onChange([{ ...prompt, ...ssmlValue, voice }])}
      autofocus={autofocus}
      placeholder={placeholder}
      onChangeVoice={(voice) => onChange([{ ...prompt, voice }])}
    />
  );
};

export default VoiceForm;
