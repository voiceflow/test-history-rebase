import * as Realtime from '@voiceflow/realtime-sdk';
import { usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import SSMLWithVars from '@/components/SSMLWithVars';

export interface PromptInputVoiceEditorProps {
  value: Realtime.SSMLData | undefined | null;
  onUpdate: (data: Partial<Realtime.SpeakData>) => void;
  placeholder?: string;
}

const PromptInputVoiceEditor: React.FC<PromptInputVoiceEditorProps> = ({ value, onUpdate, placeholder }) => {
  const updateContent = usePersistFunction(({ text }: { text: string }) => onUpdate({ content: text }));
  const updateVoice = usePersistFunction((value: string) => onUpdate({ voice: value }));

  return (
    <SSMLWithVars
      icon={null}
      voice={value?.voice}
      value={value?.content ?? ''}
      placeholder={placeholder}
      onBlur={updateContent}
      onChangeVoice={updateVoice}
      skipBlurOnUnmount
    />
  );
};

export default PromptInputVoiceEditor;
