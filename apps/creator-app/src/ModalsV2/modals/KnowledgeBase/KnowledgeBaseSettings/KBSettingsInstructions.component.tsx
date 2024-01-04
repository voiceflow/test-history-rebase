import { Box, TextArea } from '@voiceflow/ui-next';
import React from 'react';

import * as Documentation from '@/config/documentation';
import { useLinkedState } from '@/hooks/state.hook';

import { KBSettingLabel } from './KBSettingLabel.component';

export interface IKBSettingsInstructions {
  value: string;
  disabled?: boolean;
  className?: string;
  onValueChange: (system: string) => void;
}

export const KBSettingsInstructions: React.FC<IKBSettingsInstructions> = ({ value: propValue, disabled, className, onValueChange }) => {
  const [value, setValue] = useLinkedState(propValue);

  return (
    <Box width="100%" direction="column" pb={12}>
      <KBSettingLabel
        label="Instructions"
        tooltipText="This field is optional. You can use it to add custom instructions to your prompt."
        tooltipLearnMore={Documentation.KB_USAGE}
      />
      <TextArea
        value={value}
        onBlur={() => onValueChange(value)}
        minRows={1}
        disabled={disabled}
        className={className}
        placeholder="Enter LLM instructions"
        onValueChange={setValue}
      />
    </Box>
  );
};
