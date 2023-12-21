import { Utils } from '@voiceflow/common';
import { AIGPTModel } from '@voiceflow/dtos';
import { Box, Dropdown, Menu } from '@voiceflow/ui-next';
import React from 'react';

import { AI_MODEL_CONFIG_MAP, ANTHROPIC_MODEL_CONFIGS, OPEN_AI_MODEL_CONFIGS } from '@/config/ai-model';
import * as Documentation from '@/config/documentation';

import { KBSettingLabel } from './KBSettingLabel.component';
import { KBSettingsModelItem } from './KBSettingsModelItem.component';

export interface IKBSettingsModelSelect {
  value: AIGPTModel;
  disabled?: boolean;
  onValueChange: (model: AIGPTModel) => void;
}

export const KBSettingsModelSelect: React.FC<IKBSettingsModelSelect> = ({ value, disabled, onValueChange }) => {
  const modelConfig = AI_MODEL_CONFIG_MAP[value];

  return (
    <Box width="100%" direction="column" pb={12}>
      <KBSettingLabel
        label="AI model"
        tooltipText="The large language model (LLM) your agent will use to fetch and compile data."
        tooltipLearnMore={Documentation.KB_USAGE}
      />

      <Dropdown value={modelConfig.name} disabled={disabled} prefixIconName={modelConfig.icon}>
        {({ onClose }) => (
          <Menu>
            {OPEN_AI_MODEL_CONFIGS.map((model) => (
              <KBSettingsModelItem key={model.type} model={model} onClick={Utils.functional.chainVoid(onClose, () => onValueChange(model.type))} />
            ))}

            <Menu.Divider />

            {ANTHROPIC_MODEL_CONFIGS.map((model) => (
              <KBSettingsModelItem key={model.type} model={model} onClick={Utils.functional.chainVoid(onClose, () => onValueChange(model.type))} />
            ))}
          </Menu>
        )}
      </Dropdown>
    </Box>
  );
};
