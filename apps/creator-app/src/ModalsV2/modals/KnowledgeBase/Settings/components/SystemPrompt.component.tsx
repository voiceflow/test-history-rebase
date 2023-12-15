import { BaseUtils } from '@voiceflow/base-types';
import { Box, TextArea } from '@voiceflow/ui-next';
import React from 'react';

import * as Documentation from '@/config/documentation';

import { SettingsLabel } from './SettingLabel.component';

export interface ISystemPrompt {
  system?: string;
  onChange: (data: Partial<BaseUtils.ai.AIModelParams>) => void;
  className?: string;
}

export const SystemPrompt: React.FC<ISystemPrompt> = ({ system = '', onChange, className }) => {
  const [value, setValue] = React.useState<string>(system);

  return (
    <Box width="100%" direction="column">
      <SettingsLabel
        label="System"
        tooltipText="Give the system a role that it should play when creating your answers."
        tooltipLearnMore={Documentation.KB_USAGE}
      />
      <TextArea
        value={value}
        placeholder="Enter system persona"
        onBlur={() => onChange({ system: value })}
        onValueChange={setValue}
        minRows={1}
        className={className}
      />
    </Box>
  );
};
