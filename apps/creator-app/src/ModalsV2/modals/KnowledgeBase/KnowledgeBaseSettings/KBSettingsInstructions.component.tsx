import { Box, TextArea } from '@voiceflow/ui-next';
import React from 'react';

import { CMS_KNOWLEDGE_BASE_LEARN_MORE } from '@/constants/link.constant';
import { useLinkedState } from '@/hooks/state.hook';

import { KBSettingLabel } from './KBSettingLabel.component';

export interface IKBSettingsInstructions {
  value: string;
  disabled?: boolean;
  className?: string;
  maxRows?: number;
  onValueChange: (system: string) => void;
}

export const KBSettingsInstructions: React.FC<IKBSettingsInstructions> = ({ value: propValue, disabled, maxRows = 12, className, onValueChange }) => {
  const [value, setValue] = useLinkedState(propValue);

  return (
    <Box width="100%" direction="column" pb={12}>
      <KBSettingLabel
        label="Instructions"
        tooltipText="This field is optional. You can use it to add custom instructions to your prompt."
        tooltipLearnMore={CMS_KNOWLEDGE_BASE_LEARN_MORE}
      />

      <Box pl={24}>
        <TextArea
          value={value}
          onBlur={() => onValueChange(value)}
          minRows={1}
          maxRows={maxRows}
          disabled={disabled}
          className={className}
          placeholder="Enter LLM instructions"
          onValueChange={setValue}
        />
      </Box>
    </Box>
  );
};
