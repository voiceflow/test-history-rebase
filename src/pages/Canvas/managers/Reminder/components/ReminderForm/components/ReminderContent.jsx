import React from 'react';

import SSMLWithVars from '@/componentsV2/SSMLWithVars';
import Section from '@/componentsV2/Section';
import { FormControl } from '@/pages/Canvas/components/Editor';

const ReminderContent = ({ value, voice, onChange }) => {
  const updateUpsellMessage = React.useCallback(({ text }) => onChange({ text }), [onChange]);

  const updateVoice = React.useCallback((voice) => onChange({ voice }), [onChange]);

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
