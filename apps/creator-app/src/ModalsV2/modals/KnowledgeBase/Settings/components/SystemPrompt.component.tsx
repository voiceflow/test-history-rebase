import { BaseUtils } from '@voiceflow/base-types';
import { Box } from '@voiceflow/ui-next';
import { markupFactory, markupToString } from '@voiceflow/utils-designer';
import React from 'react';

import { InputWithVariables } from '@/components/Input/InputWithVariables/InputWithVariables.component';
import * as Documentation from '@/config/documentation';

import { systemPromptStyles } from '../Settings.css';
import { SettingsLabel } from './SettingLabel.component';

export interface ISystemPrompt {
  system?: string;
  onChange: (data: Partial<BaseUtils.ai.AIModelParams>) => void;
}

export const SystemPrompt: React.FC<ISystemPrompt> = ({ system = '', onChange }) => {
  const [value, setValue] = React.useState(() => markupFactory(system));

  const onBlur = () => {
    const prompt = value ? markupToString.fromDB(value, { variablesMapByID: {}, entitiesMapByID: {} }) : '';
    onChange({ system: prompt });
  };

  return (
    <Box width="100%" direction="column">
      <SettingsLabel
        label="System"
        tooltipText="Give the system a role that it should play when creating your answers."
        tooltipLearnMore={Documentation.KB_USAGE}
      />
      <InputWithVariables
        value={value}
        placeholder="Enter prompt or {variable}"
        canCreateVariables={false}
        onBlur={onBlur}
        onValueChange={setValue}
        className={systemPromptStyles}
      />
    </Box>
  );
};
