import React from 'react';

import Section from '@/components/Section';
import SSMLWithVars from '@/components/SSMLWithVars';
import { FormControl } from '@/pages/Canvas/components/Editor';

interface ReminderContentProps {
  value: string;
  voice?: string;
  onChange: (value: Partial<{ text: string; voice: string }>) => void;
}

const ReminderContent: React.FC<ReminderContentProps> = ({ value, voice, onChange }) => {
  const updateUpsellMessage = React.useCallback(({ text }: { text: string }) => onChange({ text }), [onChange]);

  const updateVoice = React.useCallback((voice: string) => onChange({ voice }), [onChange]);

  return (
    <Section isDividerNested>
      <FormControl label="Reminder Content" />

      <SSMLWithVars
        voice={voice}
        value={value}
        onBlur={updateUpsellMessage}
        placeholder="Walk dog, do dishes, plan trip to Mars, etc."
        onChangeVoice={updateVoice}
      />
    </Section>
  );
};
export default ReminderContent;
