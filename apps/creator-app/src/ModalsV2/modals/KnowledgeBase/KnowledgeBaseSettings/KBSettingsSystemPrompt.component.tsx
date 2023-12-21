import { Box, TextArea } from '@voiceflow/ui-next';
import React from 'react';

import * as Documentation from '@/config/documentation';
import { useLinkedState } from '@/hooks/state.hook';

import { KBSettingLabel } from './KBSettingLabel.component';

export interface IKBSettingsSystemPrompt {
  value: string;
  disabled?: boolean;
  className?: string;
  onValueChange: (system: string) => void;
}

export const KBSettingsSystemPrompt: React.FC<IKBSettingsSystemPrompt> = ({ value: propValue, disabled, className, onValueChange }) => {
  const [value, setValue] = useLinkedState(propValue);

  return (
    <Box width="100%" direction="column">
      <KBSettingLabel
        label="System"
        tooltipText="Give the system a role that it should play when creating your answers."
        tooltipLearnMore={Documentation.KB_USAGE}
      />

      <TextArea
        value={value}
        onBlur={() => onValueChange(value)}
        minRows={1}
        disabled={disabled}
        className={className}
        placeholder="Enter system persona"
        onValueChange={setValue}
      />
    </Box>
  );
};
