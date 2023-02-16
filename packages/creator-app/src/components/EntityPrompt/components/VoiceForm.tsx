import React from 'react';

import SSMLWithSlots from '@/components/SSMLWithSlots';

import { VoiceEntityPromptProps } from '../types';

const VoiceEntityPrompt: React.FC<VoiceEntityPromptProps> = ({ slots, prompt, isActive, autofocus, onChange, placeholder }) => (
  <SSMLWithSlots
    icon={null}
    voice={prompt.voice}
    slots={slots}
    value={prompt.text}
    onBlur={({ text, slots }) => onChange({ text, slots })}
    isActive={isActive}
    autofocus={autofocus}
    placeholder={placeholder}
    onChangeVoice={(voice) => onChange({ voice })}
  />
);

export default VoiceEntityPrompt;
